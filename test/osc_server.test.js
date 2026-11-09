/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
import assert from 'node:assert/strict'
import { createSocket } from 'node:dgram'
import { EventEmitter, once } from 'node:events'
import { test } from 'node:test'
import { InstanceStatus } from '@companion-module/base'
import osc from 'osc'
import oscServer from '../src/osc_server.js'

async function connect(t) {
	const port = new EventEmitter()
	port.socket = new EventEmitter()
	port.open = t.mock.fn()
	port.close = t.mock.fn()
	const constructor = t.mock.method(osc, 'UDPPort', function () {
		return port
	})
	const values = {}
	const instance = {
		config: { recieve_port: 7400 },
		setVariableValues: (update) => Object.assign(values, update),
		updateStatus: t.mock.fn(),
		log: t.mock.fn(),
	}
	const server = { ...oscServer, received: {} }
	await server.connect(instance)
	return { server, port, instance, values, constructor }
}

test('OSC receiver opens the configured port with typed arguments', async (t) => {
	const { constructor, port } = await connect(t)
	assert.equal(constructor.mock.callCount(), 1)
	assert.deepEqual(constructor.mock.calls[0].arguments, [{ localAddress: '0.0.0.0', localPort: 7400, metadata: true }])
	assert.equal(port.open.mock.callCount(), 1)
})

for (const [value, expected] of [
	['7400', 7400],
	[' 7400 ', 7400],
	[1, 1],
	[65535, 65535],
]) {
	test(`OSC receiver accepts receive port ${JSON.stringify(value)}`, async (t) => {
		const constructor = t.mock.method(osc, 'UDPPort', function () {
			const port = new EventEmitter()
			port.open = () => {}
			return port
		})
		const instance = { config: { recieve_port: value }, updateStatus: t.mock.fn(), log: t.mock.fn() }
		await { ...oscServer }.connect(instance)
		assert.equal(constructor.mock.calls[0].arguments[0].localPort, expected)
		assert.equal(instance.updateStatus.mock.callCount(), 0)
	})
}

for (const value of ['', '   ', 'abc', '7400abc', 7400.5, '7400.5', 0, 65536, 70000, -1, null, undefined]) {
	test(`OSC receiver reports bad configuration for receive port ${JSON.stringify(value)}`, async (t) => {
		const constructor = t.mock.method(osc, 'UDPPort', function () {
			throw new Error('a UDP port must not be created')
		})
		const instance = { config: { recieve_port: value }, updateStatus: t.mock.fn(), log: t.mock.fn() }
		const server = { ...oscServer, udpPort: undefined }
		await assert.doesNotReject(server.connect(instance))
		assert.equal(constructor.mock.callCount(), 0)
		assert.equal(server.udpPort, undefined)
		assert.equal(instance.updateStatus.mock.calls[0].arguments[0], InstanceStatus.BadConfig)
		assert.equal(instance.log.mock.calls[0].arguments[0], 'error')
		await assert.doesNotReject(server.close())
	})
}

test('OSC receiver reports ready status', async (t) => {
	const { port, instance } = await connect(t)
	port.emit('ready')
	assert.deepEqual(instance.updateStatus.mock.calls[0].arguments, [InstanceStatus.Ok, 'Connected.'])
})

test('OSC receiver buffers the latest message per address and updates variables', async (t) => {
	const { server, port, instance, values } = await connect(t)
	const address = '/d3/showcontrol/volume'
	port.emit('message', { address, args: [{ type: 'f', value: 0.25 }] })
	assert.equal(values.volume, '0.25')
	const customArgs = [{ type: 's', value: 'Fade up' }]
	port.emit('message', { address: '/d3/fadestatus', args: customArgs })
	const latestArgs = [{ type: 'f', value: 0.75 }]
	port.emit('message', { address, args: latestArgs })
	assert.deepEqual(server.getLastValueForAddress(address), latestArgs)
	assert.deepEqual(instance.oscReceived[address], latestArgs)
	assert.deepEqual(server.getLastValueForAddress('/d3/fadestatus'), customArgs)
	assert.deepEqual(instance.oscReceived['/d3/fadestatus'], customArgs)
	assert.equal(server.getLastValueForAddress('/d3/unknown'), undefined)
	assert.deepEqual(values, { volume: '0.75' })
})

test('OSC receiver reports an occupied port as a connection failure', async (t) => {
	const { port, instance } = await connect(t)
	port.emit('error', Object.assign(new Error('Address already in use'), { code: 'EADDRINUSE' }))
	assert.deepEqual(instance.updateStatus.mock.calls[0].arguments, [
		InstanceStatus.ConnectionFailure,
		'Port 7400 in use elsewhere.',
	])
	assert.equal(instance.log.mock.calls[0].arguments[0], 'error')
})

test('OSC receiver closes after a real UDP bind conflict', { timeout: 5000 }, async (t) => {
	const occupied = createSocket('udp4')
	const listening = once(occupied, 'listening')
	occupied.bind(0, '0.0.0.0')
	await listening
	t.after(() => new Promise((resolve) => occupied.close(resolve)))

	const server = { ...oscServer, received: {} }
	const instance = {
		config: { recieve_port: occupied.address().port },
		updateStatus: t.mock.fn(),
		log: t.mock.fn(),
	}
	await server.connect(instance)
	const socket = server.udpPort.socket
	let socketClosed = false
	socket.once('close', () => (socketClosed = true))
	t.after(async () => {
		if (!socketClosed) await new Promise((resolve) => socket.close(resolve))
	})
	const [error] = await once(server.udpPort, 'error')
	assert.equal(error.code, 'EADDRINUSE')

	const timeout = new Promise((_, reject) => {
		const timer = setTimeout(() => reject(new Error('Receiver close did not complete after EADDRINUSE')), 1000)
		t.after(() => clearTimeout(timer))
	})
	await Promise.race([server.close(), timeout])
})

test('OSC receiver reports other UDP errors', async (t) => {
	const { port, instance } = await connect(t)
	port.emit('error', new Error('UDP failure'))
	assert.deepEqual(instance.updateStatus.mock.calls[0].arguments, [InstanceStatus.UnknownError, 'UDP failure'])
	assert.equal(instance.log.mock.calls[0].arguments[0], 'error')
})

test('OSC receiver waits for the UDP socket to close', async (t) => {
	const { server, port } = await connect(t)
	let closed = false
	const closing = server.close().then(() => (closed = true))
	try {
		assert.equal(port.close.mock.callCount(), 1)
		// osc.UDPPort.close() returns undefined. The socket later emits close.
		await new Promise((resolve) => setImmediate(resolve))
		assert.equal(closed, false, 'close resolved before the UDP close event')
	} finally {
		port.socket.emit('close')
		await closing
	}
})

test('OSC receiver can close before a UDP port exists', async () => {
	const server = { ...oscServer, udpPort: undefined }
	await assert.doesNotReject(server.close())
})

test('OSC receiver can close before a UDP socket exists', async (t) => {
	const { server, port } = await connect(t)
	delete port.socket
	await assert.doesNotReject(server.close())
	assert.equal(port.close.mock.callCount(), 0)
	assert.equal(server.udpPort, undefined)
})

test('OSC receiver closes the UDP port only once across repeated close calls', async (t) => {
	const { server, port } = await connect(t)
	const closing = server.close()
	try {
		assert.equal(server.udpPort, undefined)
		await assert.doesNotReject(server.close())
	} finally {
		port.socket.emit('close')
		await closing
	}
	await assert.doesNotReject(server.close())
	assert.equal(port.close.mock.callCount(), 1)
})

test('OSC receiver registers for closure before calling the UDP close method', async (t) => {
	const { server, port } = await connect(t)
	port.close.mock.mockImplementation(() => {
		port.socket.emit('close')
	})
	await server.close()
	assert.equal(port.close.mock.callCount(), 1)
})

test('OSC receiver rejects closure when the UDP socket reports an error', async (t) => {
	const { server, port } = await connect(t)
	const error = new Error('UDP close failed')
	const rejection = assert.rejects(server.close(), error)
	port.socket.emit('error', error)
	await rejection
})

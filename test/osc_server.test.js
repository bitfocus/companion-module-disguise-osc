/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { test } = require('node:test')
const { InstanceStatus } = require('@companion-module/base')
const osc = require('osc')
const oscServer = require('../src/osc_server')

async function connect(t) {
	const port = new EventEmitter()
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

test('OSC receiver reports other UDP errors', async (t) => {
	const { port, instance } = await connect(t)
	port.emit('error', new Error('UDP failure'))
	assert.deepEqual(instance.updateStatus.mock.calls[0].arguments, [InstanceStatus.UnknownError, 'UDP failure'])
	assert.equal(instance.log.mock.calls[0].arguments[0], 'error')
})

test('OSC receiver waits for the UDP port to close', async (t) => {
	const { server, port } = await connect(t)
	let closed = false
	const closing = server.close().then(() => (closed = true))
	try {
		assert.equal(port.close.mock.callCount(), 1)
		// osc.UDPPort.close() returns undefined and later emits a close event.
		await new Promise((resolve) => setImmediate(resolve))
		assert.equal(closed, false, 'close resolved before the UDP close event')
	} finally {
		port.emit('close')
		await closing
	}
})

test('OSC receiver can close before a UDP port exists', async () => {
	const server = { ...oscServer, udpPort: undefined }
	await assert.doesNotReject(server.close())
})

test('OSC receiver registers for closure before calling the UDP close method', async (t) => {
	const { server, port } = await connect(t)
	port.close.mock.mockImplementation(() => {
		port.emit('close')
	})
	await server.close()
	assert.equal(port.close.mock.callCount(), 1)
})

test('OSC receiver rejects closure when the UDP port reports an error', async (t) => {
	const { server, port } = await connect(t)
	const error = new Error('UDP close failed')
	const rejection = assert.rejects(server.close(), error)
	port.emit('error', error)
	await rejection
})

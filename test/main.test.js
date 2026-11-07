/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { createRequire } = require('node:module')
const { resolve } = require('node:path')
const { test } = require('node:test')
const { runInNewContext } = require('node:vm')
const base = require('@companion-module/base')

function loadModule(t) {
	const server = { connect: t.mock.fn(), close: t.mock.fn(async () => {}) }
	const sourcePath = resolve(__dirname, '../src/main.js')
	const sourceRequire = createRequire(sourcePath)
	const timers = new Set()
	let ModuleClass
	// Capture the entrypoint without starting Companion IPC or changing production exports.
	runInNewContext(readFileSync(sourcePath, 'utf8'), {
		require: (id) => {
			if (id === '@companion-module/base') {
				return {
					...base,
					InstanceBase: class {
						updateStatus() {}
					},
					runEntrypoint: (constructor) => (ModuleClass = constructor),
				}
			}
			return id === './osc_server' ? server : sourceRequire(id)
		},
		setInterval: (callback) => {
			const timer = { callback }
			timers.add(timer)
			return timer
		},
		clearInterval: (timer) => timers.delete(timer),
	})
	return {
		server,
		timers,
		createInstance: () => {
			const instance = new ModuleClass()
			instance.log = t.mock.fn()
			instance.checkFeedbacks = t.mock.fn()
			for (const method of ['initActions', 'initPresets', 'initFeedbacks', 'initVariables']) {
				t.mock.method(instance, method, () => {})
			}
			return instance
		},
	}
}

test('Destroy closes the receiver without throwing', async (t) => {
	const { createInstance, server } = loadModule(t)
	await assert.doesNotReject(createInstance().destroy())
	assert.equal(server.close.mock.callCount(), 1)
})

test('Destroy waits for receiver closure before completing', async (t) => {
	const { createInstance, server } = loadModule(t)
	let finishClose
	server.close.mock.mockImplementation(() => new Promise((resolve) => (finishClose = resolve)))
	let destroyed = false
	const destroying = createInstance()
		.destroy()
		.then(() => (destroyed = true))
	try {
		assert.equal(server.close.mock.callCount(), 1)
		await new Promise((resolve) => setImmediate(resolve))
		assert.equal(destroyed, false, 'destroy completed before receiver closure')
	} finally {
		finishClose()
		await destroying
	}
	assert.equal(destroyed, true)
})

test('Destroy clears the blink interval after it has ticked', async (t) => {
	const { createInstance, timers } = loadModule(t)
	const instance = createInstance()
	await instance.init({ recieve_port: 7400 })
	assert.equal(timers.size, 1)
	const [timer] = timers
	assert.equal(instance.blink_button, true)
	timer.callback()
	assert.equal(instance.blink_button, false)
	timer.callback()
	assert.equal(instance.blink_button, true)
	assert.equal(instance.checkFeedbacks.mock.callCount(), 2)
	await instance.destroy()
	assert.equal(timers.size, 0, 'the blink interval remains active after destroy')
})

test('Init opens the receiver once', async (t) => {
	const { createInstance, server } = loadModule(t)
	await createInstance().init({ recieve_port: 7400 })
	assert.equal(server.connect.mock.callCount(), 1)
	assert.equal(server.close.mock.callCount(), 0)
})

test('Config update waits for receiver closure before reconnecting', async (t) => {
	const { createInstance, server } = loadModule(t)
	let finishClose
	const pendingClose = new Promise((resolve) => (finishClose = resolve))
	server.close.mock.mockImplementation(() => pendingClose)
	const instance = createInstance()
	instance.config = { recieve_port: 7400 }
	const updating = instance.configUpdated({ recieve_port: 7401 })
	try {
		assert.equal(server.close.mock.callCount(), 1)
		assert.equal(server.connect.mock.callCount(), 0, 'receiver reconnected before closure finished')
	} finally {
		finishClose()
		await updating
	}
	assert.equal(server.connect.mock.callCount(), 1)
	assert.equal(instance.config.recieve_port, 7401)
})

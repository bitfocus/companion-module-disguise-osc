const assert = require('node:assert/strict')
const { test } = require('node:test')
const { once } = require('node:events')
const osc = require('osc')
const server = require('../src/osc_server')
const { initActions } = require('../src/actions')
const { initFeedbacks } = require('../src/feedbacks')

test('OSC loopback sends prepared actions and receives variable and feedback state after reconnect', async () => {
	const peer = new osc.UDPPort({ localAddress: '127.0.0.1', localPort: 0, metadata: true })
	const values = {}
	let actions, feedbacks
	const instance = {
		config: { recieve_port: 0 },
		log: () => {},
		updateStatus: () => {},
		setVariableValues: (next) => Object.assign(values, next),
		getVariableValue: (id) => values[id],
		setActionDefinitions: (next) => (actions = next),
		setFeedbackDefinitions: (next) => (feedbacks = next),
		parseVariablesInString: () => assert.fail('Prepared text must not be parsed twice'),
		sendOscMessage: (address, args) => peer.send({ address, args }, '127.0.0.1', server.udpPort.socket.address().port),
	}
	initActions.call(instance)
	initFeedbacks.call(instance)
	peer.open()
	await once(peer, 'ready')
	try {
		for (let cycle = 0; cycle < 2; cycle++) {
			await server.connect(instance)
			await once(server.udpPort, 'ready')
			let packet = once(server.udpPort, 'message')
			await actions.cue.callback({ options: { int: '1.2.5' } })
			assert.deepEqual((await packet)[0], {
				address: '/d3/showcontrol/cue',
				args: [1, 2, 5].map((value) => ({ type: 'i', value })),
			})
			packet = once(server.udpPort, 'message')
			await actions.custom_osc.callback({
				options: { osc_path: '/custom', arg_type: 'string', arg_value: 'literal $(internal:value)' },
			})
			assert.equal((await packet)[0].args[0].value, 'literal $(internal:value)')
			assert.equal(
				await feedbacks.custom_osc_feedback.callback({
					options: {
						d3_osc_path: '/custom',
						expected_value: 'literal $(internal:value)',
						comparison: 'equals',
						value_type: 'string',
					},
				}),
				true,
			)
			assert.equal(
				await feedbacks.custom_osc_feedback.callback({
					options: { d3_osc_path: '/custom', expected_value: 'changed', comparison: 'equals', value_type: 'string' },
				}),
				false,
			)
			packet = once(server.udpPort, 'message')
			peer.send(
				{ address: '/d3/showcontrol/brightness', args: [{ type: 'f', value: 0 }] },
				'127.0.0.1',
				server.udpPort.socket.address().port,
			)
			await packet
			assert.equal(values.brightness, '0.00')
			instance.blink_button = true
			assert.equal(feedbacks.Brightness.callback(), true)
			const closed = once(server.udpPort, 'close')
			await server.close(instance)
			await closed
		}
	} finally {
		peer.close()
	}
})

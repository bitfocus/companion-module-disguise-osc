/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { initFeedbacks } = require('../src/feedbacks')
const oscServer = require('../src/osc_server')
const utils = require('../src/utils')

function createFeedbacks(variables = {}) {
	let feedbacks
	const logs = []
	const instance = {
		setFeedbackDefinitions: (definitions) => (feedbacks = definitions),
		getVariableValue: (id) => variables[id],
		log: (level, message) => logs.push({ level, message }),
	}
	initFeedbacks.call(instance)
	return { feedbacks, instance, logs }
}

function customFeedback(t, args) {
	const previous = oscServer.received
	t.after(() => {
		oscServer.received = previous
	})
	oscServer.received = { '/d3/fadestatus': args }
	const { feedbacks, logs } = createFeedbacks()
	return {
		logs,
		compare: (options = {}, context) =>
			feedbacks.custom_osc_feedback.callback(
				{
					options: {
						d3_osc_path: '/d3/fadestatus',
						expected_value: 'Fade up',
						comparison: 'equals',
						value_type: 'string',
						...options,
					},
				},
				context,
			),
	}
}

// https://help.disguise.one/designer/timeline-tracks-transports/osc/monitoring-custom#fade-status
test('Custom feedback matches the fade status at the selected address', async (t) => {
	const { compare } = customFeedback(t, [{ type: 's', value: 'Fade up' }])
	assert.equal(await compare(), true)
	assert.equal(await compare({ expected_value: 'Fade down' }), false)
	assert.equal(await compare({ d3_osc_path: '/d3/otherstatus' }), false)
})

for (const [option, resolved] of [
	['d3_osc_path', '/d3/fadestatus'],
	['expected_value', 'Fade up'],
]) {
	test(`Custom feedback resolves variables in ${option}`, async (t) => {
		const { compare } = customFeedback(t, [{ type: 's', value: 'Fade up' }])
		const context = {
			parseVariablesInString: async (text) => (text === '$(internal:value)' ? resolved : text),
		}
		assert.equal(await compare({ [option]: '$(internal:value)' }, context), true)
	})
}

test('Custom feedback supports contains and regex comparisons', async (t) => {
	const { compare } = customFeedback(t, [{ type: 's', value: 'Output hold' }])
	assert.equal(await compare({ comparison: 'contains', expected_value: 'hold' }), true)
	assert.equal(await compare({ comparison: 'contains', expected_value: 'Fade' }), false)
	assert.equal(await compare({ comparison: 'regex', expected_value: '^Output (hold|live)$' }), true)
	assert.equal(await compare({ comparison: 'regex', expected_value: '^Fade' }), false)
	assert.equal(await compare({ comparison: 'unknown' }), false)
})

test('Custom feedback handles an invalid regex without throwing', async (t) => {
	const { compare, logs } = customFeedback(t, [{ type: 's', value: 'Fade up' }])
	assert.equal(await compare({ comparison: 'regex', expected_value: '[' }), false)
	assert.equal(logs.length, 1)
	assert.equal(logs[0].level, 'debug')
})

for (const [valueType, received, expected] of [
	['int', { type: 'i', value: 0 }, '0'],
	['int', { type: 'i', value: -2 }, '-2'],
	['float', { type: 'f', value: 0.25 }, '2.5e-1'],
	['int', 0, '0'],
	['string', 'Fade up', 'Fade up'],
]) {
	test(`Custom feedback compares ${JSON.stringify(received)} with ${expected}`, async (t) => {
		const { compare } = customFeedback(t, [received])
		assert.equal(await compare({ value_type: valueType, expected_value: expected }), true)
		assert.equal(
			await compare({ value_type: valueType, expected_value: valueType === 'string' ? 'Fade down' : '42' }),
			false,
		)
	})
}

for (const [valueType, expected] of [
	['int', '1.5'],
	['int', '1x'],
	['float', 'invalid'],
	['float', '1.2.3'],
]) {
	test(`Custom feedback rejects invalid ${valueType} input ${expected}`, async (t) => {
		const { compare } = customFeedback(t, [{ type: 'f', value: 1.5 }])
		assert.equal(await compare({ value_type: valueType, expected_value: expected }), false)
	})
}

for (const args of [undefined, []]) {
	test(`Custom feedback returns false when arguments are ${JSON.stringify(args)}`, async (t) => {
		const { compare } = customFeedback(t, args)
		assert.equal(await compare(), false)
	})
}

test('Custom feedback uses the first argument and the latest buffered value', async (t) => {
	const { compare } = customFeedback(t, [
		{ type: 's', value: 'Fade down' },
		{ type: 's', value: 'Fade up' },
	])
	assert.equal(await compare(), false)
	oscServer.received['/d3/fadestatus'] = [{ type: 's', value: 'Fade up' }]
	assert.equal(await compare(), true)
})

for (const [id, variable] of [
	['Brightness', 'brightness'],
	['Volume', 'volume'],
]) {
	test(`${id} feedback blinks only at zero`, () => {
		const variables = { [variable]: '0.00' }
		const { feedbacks, instance } = createFeedbacks(variables)
		instance.blink_button = true
		assert.equal(feedbacks[id].callback(), true)
		instance.blink_button = false
		assert.equal(feedbacks[id].callback(), false)
		instance.blink_button = true
		variables[variable] = '0.50'
		assert.equal(feedbacks[id].callback(), false)
	})
}

test('Play mode feedback requires the selected mode and the blink phase', () => {
	const { feedbacks, instance } = createFeedbacks()
	instance.PLAYMODE = '02'
	instance.blink_button = true
	assert.equal(feedbacks.PlayMode.callback({ options: { mode: '02' } }), true)
	assert.equal(feedbacks.PlayMode.callback({ options: { mode: '00' } }), false)
	instance.blink_button = false
	assert.equal(feedbacks.PlayMode.callback({ options: { mode: '02' } }), false)
})

test('Shift feedback selects decrease or increase for both levels', (t) => {
	const previousShift = utils.shift
	t.after(() => {
		utils.shift = previousShift
	})
	const { feedbacks } = createFeedbacks()
	for (const shift of [false, true]) {
		utils.shift = shift
		for (const level of ['brightness', 'volume']) {
			assert.equal(feedbacks[`decrease_${level}`].callback(), shift)
			assert.equal(feedbacks[`increase_${level}`].callback(), !shift)
		}
	}
})

/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { initFeedbacks } = require('../src/feedbacks')
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

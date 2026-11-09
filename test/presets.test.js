/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=22.0.0" }] */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initActions } from '../src/actions.js'
import { initFeedbacks } from '../src/feedbacks.js'
import { initPresets } from '../src/presets.js'

function definitions() {
	let actions, feedbacks, structure, presets
	const instance = {
		setActionDefinitions: (value) => (actions = value),
		setFeedbackDefinitions: (value) => (feedbacks = value),
		setPresetDefinitions: (sections, value) => ((structure = sections), (presets = value)),
	}
	initActions.call(instance)
	initFeedbacks.call(instance)
	initPresets.call(instance)
	return { actions, feedbacks, structure, presets }
}

test('Every preset is listed once in the preset structure', () => {
	const { structure, presets } = definitions()
	const listed = structure.flatMap(({ definitions }) => definitions)
	assert.deepEqual([...listed].sort(), Object.keys(presets).sort())
})

test('Presets use the API 2 format and refer to real actions and feedbacks', () => {
	const { actions, feedbacks, presets } = definitions()
	for (const [id, preset] of Object.entries(presets)) {
		assert.equal(preset.type, 'simple', id)
		assert.equal(preset.category, undefined, id)
		assert.equal(typeof preset.style.text, 'string', id)
		assert.notEqual(preset.style.size, undefined, id)
		for (const step of preset.steps) {
			for (const action of [...step.down, ...step.up]) {
				assert.ok(actions[action.actionId], `${id}: ${action.actionId}`)
				assert.equal(typeof action.options, 'object', id)
			}
		}
		for (const feedback of preset.feedbacks) {
			assert.ok(feedbacks[feedback.feedbackId], `${id}: ${feedback.feedbackId}`)
			assert.equal(typeof feedback.options, 'object', id)
		}
	}
})

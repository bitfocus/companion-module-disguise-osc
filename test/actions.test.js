/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { initActions } = require('../src/actions')

function createCueAction() {
	const messages = []
	const logs = []
	let cue
	initActions.call({
		setActionDefinitions: (actions) => {
			cue = actions.cue
		},
		sendOscMessage: (path, args) => messages.push({ path, args }),
		log: (level, message) => logs.push({ level, message }),
	})
	return { cue, messages, logs }
}

test('Cue sends 1 to 3 parts as separate OSC integers', async () => {
	const { cue, messages } = createCueAction()
	const cases = [
		[1, [1]],
		['5', [5]],
		['0', [0]],
		['1.2', [1, 2]],
		['1.2.5', [1, 2, 5]],
		['1.0.0', [1, 0, 0]],
		[' 001.02.005 ', [1, 2, 5]],
		['2147483647.0.2147483647', [2147483647, 0, 2147483647]],
	]
	for (const [input, values] of cases) {
		await cue.callback({ options: { int: input } })
		assert.deepEqual(messages.at(-1), {
			path: '/d3/showcontrol/cue',
			args: values.map((value) => ({ type: 'i', value })),
		})
	}
	assert.equal(messages.length, cases.length)
})

test('Cue splits the value prepared by the host', async () => {
	const { cue, messages } = createCueAction()
	await cue.callback(
		{ options: { int: '1.2.5' } },
		{
			parseVariablesInString: async (input) => {
				assert.fail('Host-prepared values must not be parsed again: ' + input)
			},
		},
	)
	assert.deepEqual(messages, [
		{
			path: '/d3/showcontrol/cue',
			args: [
				{ type: 'i', value: 1 },
				{ type: 'i', value: 2 },
				{ type: 'i', value: 5 },
			],
		},
	])
})

test('Cue rejects invalid parts, extra parts, and integers outside the OSC range', async () => {
	const { cue, messages, logs } = createCueAction()
	const invalidCues = [
		'',
		' ',
		'.1',
		'1.',
		'1..2',
		'1.2.3.4',
		'1.2x',
		'1.2.5foo',
		'1,2,5',
		'1 2 5',
		'1e2',
		'NaN',
		'Infinity',
		'-1',
		'+1',
		'-0',
		'1.-2',
		'1.+2',
		'1.2.-5',
		'1.2.+5',
		'2147483648',
		'1.-2147483649',
		'1.2.999999999999999999999',
		undefined,
		null,
	]
	for (const input of invalidCues) {
		await cue.callback({ options: { int: input } })
	}
	assert.deepEqual(messages, [])
	assert.equal(logs.filter(({ level }) => level === 'error').length, invalidCues.length)
})

test('Cue rejects an invalid value from a variable', async () => {
	const { cue, messages, logs } = createCueAction()
	const invalidCues = ['1.2.3.4', '-1', '+1', '1.-2', '1.+2', '1.2.-5', '1.2.+5']
	for (const value of invalidCues) {
		await cue.callback({ options: { int: value } })
	}
	assert.deepEqual(messages, [])
	assert.equal(logs.filter(({ level }) => level === 'error').length, invalidCues.length)
})

test('Cue input accepts multipart numbers and variables', () => {
	const { cue } = createCueAction()
	const { regex } = cue.options.find(({ id }) => id === 'int')
	for (const value of ['0', '1', '1.2', '1.2.5', '$(internal:cue_number)']) {
		assert.ok(regex.test(value), value)
	}
	for (const value of ['', '-1', '+1', '-0', '1.-2', '1.+2', '1.2.-5', '1.2.+5', '1.', '1..2', '1.2.3.4', '1.2x']) {
		assert.ok(!regex.test(value), value)
	}
})

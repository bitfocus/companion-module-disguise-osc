/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { initActions } = require('../src/actions')
const utils = require('../src/utils')

function createActions(variables = {}, parseVariablesInString = async (text) => text) {
	const messages = []
	const logs = []
	const feedbackChecks = []
	let definitions
	initActions.call({
		setActionDefinitions: (actions) => {
			definitions = actions
		},
		sendOscMessage: (path, args) => messages.push({ path, args }),
		log: (level, message) => logs.push({ level, message }),
		getVariableValue: (id) => variables[id],
		checkFeedbacks: (...ids) => feedbackChecks.push(ids),
		parseVariablesInString,
	})
	return { actions: definitions, cue: definitions.cue, messages, logs, feedbackChecks }
}

test('Cue sends 1 to 3 parts as separate OSC integers', async () => {
	const { cue, messages } = createActions()
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

test('Cue resolves variables before it splits the parts', async () => {
	const { cue, messages } = createActions()
	await cue.callback(
		{ options: { int: '$(internal:cue_number)' } },
		{
			parseVariablesInString: async (input) => {
				assert.equal(input, '$(internal:cue_number)')
				return '1.2.5'
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
	const { cue, messages, logs } = createActions()
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
	const { cue, messages, logs } = createActions()
	const invalidCues = ['1.2.3.4', '-1', '+1', '1.-2', '1.+2', '1.2.-5', '1.2.+5']
	for (const value of invalidCues) {
		await cue.callback({ options: { int: '$(internal:cue_number)' } }, { parseVariablesInString: async () => value })
	}
	assert.deepEqual(messages, [])
	assert.equal(logs.filter(({ level }) => level === 'error').length, invalidCues.length)
})

test('Cue input accepts multipart numbers and variables', () => {
	const { cue } = createActions()
	const { regex } = cue.options.find(({ id }) => id === 'int')
	for (const value of ['0', '1', '1.2', '1.2.5', '$(internal:cue_number)']) {
		assert.ok(regex.test(value), value)
	}
	for (const value of ['', '-1', '+1', '-0', '1.-2', '1.+2', '1.2.-5', '1.2.+5', '1.', '1..2', '1.2.3.4', '1.2x']) {
		assert.ok(!regex.test(value), value)
	}
})

// https://help.disguise.one/designer/timeline-tracks-transports/osc/controlling
for (const [id, address] of [
	['play', '/d3/showcontrol/play'],
	['playsection', '/d3/showcontrol/playsection'],
	['loopsection', '/d3/showcontrol/loop'],
	['stop', '/d3/showcontrol/stop'],
	['previoussection', '/d3/showcontrol/previoussection'],
	['nextsection', '/d3/showcontrol/nextsection'],
	['returntostart', '/d3/showcontrol/returntostart'],
	['previoustrack', '/d3/showcontrol/previoustrack'],
	['nexttrack', '/d3/showcontrol/nexttrack'],
	['fadeup', '/d3/showcontrol/fadeup'],
	['fadedown', '/d3/showcontrol/fadedown'],
	['hold', '/d3/showcontrol/hold'],
]) {
	test(`${id} sends the documented address with no arguments`, async () => {
		const { actions, messages } = createActions()
		await actions[id].callback()
		assert.deepEqual(messages, [{ path: address, args: [] }])
	})
}

test('Track name sends one OSC string', async () => {
	const { actions, messages } = createActions()
	await actions.trackname.callback({ options: { string: 'Opening track' } })
	assert.deepEqual(messages, [{ path: '/d3/showcontrol/trackname', args: [{ type: 's', value: 'Opening track' }] }])
})

test('Track name resolves variables before sending', async () => {
	const { actions, messages } = createActions()
	await actions.trackname.callback(
		{ options: { string: '$(internal:track)' } },
		{
			parseVariablesInString: async (text) => {
				assert.equal(text, '$(internal:track)')
				return 'Opening track'
			},
		},
	)
	assert.deepEqual(messages, [{ path: '/d3/showcontrol/trackname', args: [{ type: 's', value: 'Opening track' }] }])
})

test('Toggle shift changes direction and checks feedback without throwing', (t) => {
	const previousShift = utils.shift
	t.after(() => {
		utils.shift = previousShift
	})
	utils.shift = false
	const { actions, feedbackChecks } = createActions()
	actions.shift.callback()
	assert.equal(utils.shift, true)
	assert.deepEqual(feedbackChecks, [[]])
})

// https://help.disguise.one/designer/timeline-tracks-transports/osc/triggering-cues-with-osc
for (const [id, option, input, type, value] of [
	['trackid', 'int', '42', 'i', 42],
	['floatcue', 'float', '1.10', 'f', 1.1],
	['floatcue', 'float', '1.01', 'f', 1.01],
]) {
	for (const resolveVariables of [false, true]) {
		test(`${id} sends ${input} as one ${type} argument (variables: ${resolveVariables})`, async () => {
			const { actions, messages } = createActions()
			const context = resolveVariables
				? {
						parseVariablesInString: async (text) => {
							assert.equal(text, '$(internal:value)')
							return input
						},
					}
				: undefined
			await actions[id].callback({ options: { [option]: resolveVariables ? '$(internal:value)' : input } }, context)
			assert.deepEqual(messages, [{ path: `/d3/showcontrol/${id}`, args: [{ type, value }] }])
		})
	}
}

for (const [id, option] of [
	['trackid', 'int'],
	['floatcue', 'float'],
]) {
	test(`${id} does not send a nonnumeric value`, async () => {
		const { actions, messages } = createActions()
		await actions[id].callback({ options: { [option]: 'invalid' } })
		await actions[id].callback(
			{ options: { [option]: '$(internal:value)' } },
			{ parseVariablesInString: async () => 'invalid' },
		)
		assert.deepEqual(messages, [])
	})
}

for (const [argType, input, type, value] of [
	['string', 'Fade up', 's', 'Fade up'],
	['int', '0', 'i', 0],
	['float', '0.25', 'f', 0.25],
]) {
	test(`Custom OSC sends a resolved path and ${argType} value`, async () => {
		const { actions, messages } = createActions()
		await actions.custom_osc.callback(
			{ options: { osc_path: '$(internal:path)', arg_type: argType, arg_value: '$(internal:value)' } },
			{
				parseVariablesInString: async (text) => {
					assert.ok(['$(internal:path)', '$(internal:value)'].includes(text))
					return text === '$(internal:path)' ? '/d3/custom/status' : input
				},
			},
		)
		assert.deepEqual(messages, [{ path: '/d3/custom/status', args: [{ type, value }] }])
	})
}

for (const [path, argType, value] of [
	['d3/status', 'string', 'Fade up'],
	['/', 'string', 'Fade up'],
	['', 'string', 'Fade up'],
	['/d3/status', 'int', 'invalid'],
	['/d3/status', 'float', 'invalid'],
]) {
	test(`Custom OSC rejects path=${JSON.stringify(path)}, type=${argType}, value=${value}`, async () => {
		const { actions, messages, logs } = createActions()
		await actions.custom_osc.callback({ options: { osc_path: path, arg_type: argType, arg_value: value } })
		assert.deepEqual(messages, [])
		assert.equal(logs.filter(({ level }) => level === 'error').length, 1)
	})
}

/* eslint n/no-unsupported-features/node-builtins: ["error", { version: ">=20.0.0" }] */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const utils = require('../src/utils')
const { initVariables } = require('../src/variables')

function receive(address, type, value) {
	const values = {}
	const instance = { setVariableValues: (update) => Object.assign(values, update) }
	utils.processMessage({ address, args: [{ type, value }] }, instance)
	return { values, instance }
}

// https://help.disguise.one/designer/timeline-tracks-transports/osc/monitoring
for (const [address, type, input, variable, expected] of [
	['heartbeat', 'f', 0, 'heartbeat', '0.00'],
	['heartbeat', 'f', 1, 'heartbeat', '1.00'],
	['heartbeat', 'f', 0.456, 'heartbeat', '0.46'],
	['trackname', 's', 'Opening track', 'trackname', 'Opening track'],
	['trackid', 's', 'intro-01', 'trackid', 'intro-01'],
	['currentsectionname', 's', 'Verse', 'currentSectionName', 'Verse'],
	['nextsectionname', 's', 'Chorus', 'nextSectionName', 'Chorus'],
	['currentsectionname', 's', '', 'currentSectionName', 'Start'],
	['nextsectionname', 's', '', 'nextSectionName', 'End'],
	['volume', 'f', 0, 'volume', '0.00'],
	['volume', 'f', 1, 'volume', '1.00'],
	['volume', 'f', 0.456, 'volume', '0.46'],
	['brightness', 'f', 0, 'brightness', '0.00'],
	['brightness', 'f', 1, 'brightness', '1.00'],
	['brightness', 'f', 0.456, 'brightness', '0.46'],
	['bpm', 'f', 120.5, 'bpm', 120.5],
]) {
	test(`${address} maps ${JSON.stringify(input)} to ${variable}`, () => {
		const { values } = receive(`/d3/showcontrol/${address}`, type, input)
		assert.deepEqual(values, { [variable]: expected })
	})
}

for (const address of ['trackposition', 'timecodeposition']) {
	test(`${address} preserves timecode and splits hours, minutes, seconds, and frames`, () => {
		const { values } = receive(`/d3/showcontrol/${address}`, 's', '01:23:45.06')
		assert.deepEqual(values, {
			[address]: '01:23:45.06',
			[`${address}_hh`]: '01',
			[`${address}_mm`]: '23',
			[`${address}_ss`]: '45',
			[`${address}_ff`]: '06',
		})
	})
}

// https://help.disguise.one/designer/timeline-tracks-transports/osc/monitoring-custom
test('Section hint preserves names and extracts elapsed and remaining time', () => {
	const hint = 'Opening verse|1.2 +00:01:23.04 Next chorus|2 -00:00:56.07'
	const { values } = receive('/d3/showcontrol/sectionhint', 's', hint)
	assert.equal(values.sectionHint, hint)
	// The module currently exposes RegExp match arrays for these two variables.
	assert.equal(values.sectionElapsed[0], '+00:01:23.04')
	assert.equal(values.sectionRemaining[0], '-00:00:56.07')
})

test('A custom section hint without times clears elapsed and remaining time', () => {
	const { values } = receive('/d3/showcontrol/sectionhint', 's', 'No matching timecode')
	assert.deepEqual(values, {
		sectionHint: 'No matching timecode',
		sectionElapsed: null,
		sectionRemaining: null,
	})
})

for (const [mode, expected] of [
	['Play', '00'],
	['PlaySection', '01'],
	['LoopSection', '02'],
	['Stop', '03'],
	['HoldSection', '04'],
	['HoldEnd', '05'],
]) {
	test(`Play mode ${mode} sets its variable and feedback selection`, () => {
		const { values, instance } = receive('/d3/showcontrol/playmode', 's', mode)
		assert.deepEqual(values, { playMode: mode })
		assert.equal(instance.PLAYMODE, expected)
	})
}

test('Empty arguments and unknown addresses leave variables and play mode unchanged', () => {
	const values = { trackname: 'Opening track' }
	const instance = { PLAYMODE: '00', setVariableValues: (update) => Object.assign(values, update) }
	for (const address of [
		'heartbeat',
		'trackposition',
		'timecodeposition',
		'trackname',
		'trackid',
		'currentsectionname',
		'nextsectionname',
		'sectionhint',
		'volume',
		'brightness',
		'bpm',
		'playmode',
	]) {
		utils.processMessage({ address: `/d3/showcontrol/${address}`, args: [] }, instance)
	}
	utils.processMessage({ address: '/d3/fadestatus', args: [{ type: 's', value: 'Fade up' }] }, instance)
	assert.deepEqual(values, { trackname: 'Opening track' })
	assert.equal(instance.PLAYMODE, '00')
})

test('All variables set by transport messages have a variable definition', () => {
	let definitions
	initVariables.call({ setVariableDefinitions: (value) => (definitions = value) })
	const ids = definitions.map(({ variableId }) => variableId)
	assert.equal(new Set(ids).size, ids.length)
	const variables = [
		...Object.keys(receive('/d3/showcontrol/trackposition', 's', '00:00:00.00').values),
		...Object.keys(receive('/d3/showcontrol/timecodeposition', 's', '00:00:00.00').values),
		...Object.keys(receive('/d3/showcontrol/sectionhint', 's', 'Start +00:00:00.00 End -00:01:00.00').values),
		'heartbeat',
		'trackname',
		'trackid',
		'currentSectionName',
		'nextSectionName',
		'volume',
		'brightness',
		'bpm',
		'playMode',
	]
	for (const variable of variables) assert.ok(ids.includes(variable), variable)
})

test('Level calculations round to two decimal places and clamp at zero and one', () => {
	assert.equal(utils.increment_float('0.10', '0.20'), '0.30')
	assert.equal(utils.decrement_float('0.30', '0.20'), '0.10')
	assert.equal(utils.increment_float('0.50', '0.006'), '0.51')
	assert.equal(utils.decrement_float('0.50', '0.006'), '0.49')
	assert.equal(utils.increment_float('0.99', '0.10'), '1.00')
	assert.equal(utils.decrement_float('0.01', '0.10'), '0.00')
})

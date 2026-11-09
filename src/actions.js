import choices from './choices.js'
import utils from './utils.js'

const INT_MAX = 2147483647
const INT_MIN = -2147483648

// Whole-value number checks. Companion passes bad values through (allowInvalidValues), so
// these stop parseInt and parseFloat from sending part of a value, such as 12 for 12abc.
function parseWholeInt(rawValue) {
	const text = String(rawValue ?? '').trim()
	const int = Number(text)
	return /^[-+]?\d+$/.test(text) && int >= INT_MIN && int <= INT_MAX ? int : null
}

function parseWholeFloat(rawValue) {
	const text = String(rawValue ?? '').trim()
	const float = Number(text)
	return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(text) && Number.isFinite(float) ? float : null
}

// Builds the OSC arguments for the custom action. The whole value must be valid,
// so a bad value is reported and not sent as a shortened number.
function customOscArgs(argType, rawValue) {
	const value = String(rawValue).trim()
	switch (argType) {
		case 'none':
			return []
		case 'int': {
			const int = parseWholeInt(value)
			if (int === null) return { error: 'Argument is not a valid integer: ' + value }
			return [{ type: 'i', value: int }]
		}
		case 'float': {
			const float = parseWholeFloat(value)
			if (float === null) return { error: 'Argument is not a valid float: ' + value }
			return [{ type: 'f', value: float }]
		}
		case 'int_parts': {
			const parts = value.split('.').map(Number)
			if (!/^\d+(?:\.\d+)*$/.test(value) || parts.some((part) => part > INT_MAX)) {
				return { error: 'Argument is not valid integer parts: ' + value }
			}
			return parts.map((part) => ({ type: 'i', value: part }))
		}
		default:
			return [{ type: 's', value: rawValue }]
	}
}

export function initActions() {
	let self = this
	let actions = {}

	const showcontrol_base_address = '/d3/showcontrol/'
	const layer_base_address = '/d3/layer/'

	// utility actions
	actions['shift'] = {
		name: 'Toggle shift',
		options: [],
		callback: () => {
			utils.shift = !utils.shift
			self.checkAllFeedbacks()
		},
	}
	// showcontrol actions
	actions['play'] = {
		name: 'Play',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}play`

			this.sendOscMessage(path, [])
		},
	}
	actions['playsection'] = {
		name: 'Play to end of section',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}playsection`

			this.sendOscMessage(path, [])
		},
	}
	actions['loopsection'] = {
		name: 'Loop section',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}loop`

			this.sendOscMessage(path, [])
		},
	}
	actions['stop'] = {
		name: 'Stop',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}stop`

			this.sendOscMessage(path, [])
		},
	}
	actions['previoussection'] = {
		name: 'Previous section',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}previoussection`

			this.sendOscMessage(path, [])
		},
	}
	actions['nextsection'] = {
		name: 'Next section',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}nextsection`

			this.sendOscMessage(path, [])
		},
	}
	actions['returntostart'] = {
		name: 'Return to start',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}returntostart`

			this.sendOscMessage(path, [])
		},
	}
	actions['previoustrack'] = {
		name: 'Previous track',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}previoustrack`

			this.sendOscMessage(path, [])
		},
	}
	actions['nexttrack'] = {
		name: 'Next track',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}nexttrack`

			this.sendOscMessage(path, [])
		},
	}
	actions['trackname'] = {
		name: 'Track name',
		options: [
			{
				type: 'textinput',
				label: 'Track name (string)',
				id: 'string',
				default: 'text',
				useVariables: true,
			},
		],
		callback: (event) => {
			const path = `${showcontrol_base_address}trackname`
			const trackName = event.options.string
			this.sendOscMessage(path, [
				{
					type: 's',
					value: '' + trackName,
				},
			])
		},
	}
	actions['trackid'] = {
		name: 'Track ID',
		options: [
			{
				type: 'textinput',
				label: 'Track ID (integer)',
				id: 'int',
				default: '1',
				regex: '/^[-+]?\\d+$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (action) => {
			const path = `${showcontrol_base_address}trackid`
			const intVal = parseWholeInt(action.options.int)
			if (intVal === null) {
				this.log('error', `[trackid] Enter a whole number: ${action.options.int}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: intVal,
				},
			])
		},
	}
	actions['cue'] = {
		name: 'Cue',
		options: [
			{
				type: 'textinput',
				label: 'Cue (integer parts or variable)',
				id: 'int',
				default: '1',
				regex: '/^\\d+(?:\\.\\d+){0,2}$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
				tooltip: 'Enter 1 to 3 unsigned integers separated by dots, e.g. 1.2.5, or a variable with this value.',
				error: 'Enter 1 to 3 unsigned integers separated by dots, or a variable with this value.',
			},
		],
		callback: (action) => {
			const path = `${showcontrol_base_address}cue`
			const intStr = action.options.int
			const cue = String(intStr).trim()
			if (!/^\d+(?:\.\d+){0,2}$/.test(cue)) {
				this.log('error', '[cue] Enter 1 to 3 unsigned integers separated by dots.')
				return
			}
			const parts = cue.split('.').map(Number)
			if (parts.some((part) => part > 2147483647)) {
				this.log('error', '[cue] Each part must be between 0 and 2147483647.')
				return
			}
			this.sendOscMessage(
				path,
				parts.map((value) => ({ type: 'i', value })),
			)
		},
	}
	actions['floatcue'] = {
		name: 'Float Cue',
		options: [
			{
				type: 'textinput',
				label: 'Float Cue (float or variable)',
				id: 'float',
				default: '1.0',
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
				tooltip: 'Enter a float or a variable that resolves to a float.',
				error: 'Please enter a valid float or variable that resolves to a float.',
			},
		],
		callback: (action) => {
			const path = `${showcontrol_base_address}floatcue`
			const floatVal = parseWholeFloat(action.options.float)
			if (floatVal === null) {
				this.log('error', `[floatcue] Enter a number: ${action.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: floatVal,
				},
			])
		},
	}
	actions['fadeup'] = {
		name: 'Fade up',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}fadeup`

			this.sendOscMessage(path, [])
		},
	}
	actions['fadedown'] = {
		name: 'Fade down',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}fadedown`

			this.sendOscMessage(path, [])
		},
	}
	actions['hold'] = {
		name: 'Hold',
		options: [],
		callback: () => {
			const path = `${showcontrol_base_address}hold`

			this.sendOscMessage(path, [])
		},
	}
	actions['shift_brightness'] = {
		name: 'Shift aware brightness',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[shift_brightness] Enter a number for the step: ${event.options.float}`)
				return
			}
			const brightness = this.getVariableValue('brightness')
			let new_brightness = utils.shift
				? utils.decrement_float(brightness, step)
				: utils.increment_float(brightness, step)
			const path = `${showcontrol_base_address}brightness`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_brightness),
				},
			])
		},
	}
	actions['increment_brightness'] = {
		name: 'Increase brightness',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[increment_brightness] Enter a number for the step: ${event.options.float}`)
				return
			}
			const brightness = this.getVariableValue('brightness')
			const new_brightness = utils.increment_float(brightness, step)
			const path = `${showcontrol_base_address}brightness`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_brightness),
				},
			])
		},
	}
	actions['decrement_brightness'] = {
		name: 'Decrease brightness',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[decrement_brightness] Enter a number for the step: ${event.options.float}`)
				return
			}
			const brightness = this.getVariableValue('brightness')
			let new_brightness = utils.decrement_float(brightness, step)
			const path = `${showcontrol_base_address}brightness`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_brightness),
				},
			])
		},
	}
	actions['shift_volume'] = {
		name: 'Shift aware volume',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[shift_volume] Enter a number for the step: ${event.options.float}`)
				return
			}
			const volume = this.getVariableValue('volume')
			let new_volume = utils.shift ? utils.decrement_float(volume, step) : utils.increment_float(volume, step)
			const path = `${showcontrol_base_address}volume`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_volume),
				},
			])
		},
	}
	actions['increment_volume'] = {
		name: 'Increase volume',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[increment_volume] Enter a number for the step: ${event.options.float}`)
				return
			}
			const volume = this.getVariableValue('volume')
			const new_volume = utils.increment_float(volume, step)
			const path = `${showcontrol_base_address}volume`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_volume),
				},
			])
		},
	}
	actions['decrement_volume'] = {
		name: 'Decrease volume',
		options: [
			{
				type: 'textinput',
				label: 'Step (float)',
				id: 'float',
				default: '0.01',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const step = parseWholeFloat(event.options.float)
			if (step === null) {
				this.log('error', `[decrement_volume] Enter a number for the step: ${event.options.float}`)
				return
			}
			const volume = this.getVariableValue('volume')
			const new_volume = utils.decrement_float(volume, step)
			const path = `${showcontrol_base_address}volume`
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(new_volume),
				},
			])
		},
	}
	// layer control actions
	actions['layer_blendmode'] = {
		name: 'Layer blendmode',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				disableAutoExpression: true,
				id: 'mode',
				label: 'Blendmode:',
				default: '00',
				choices: choices.BLENDMODE,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/blendmode`
			const int = event.options.mode

			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
				},
			])
		},
	}
	actions['layer_brightness'] = {
		name: 'Layer brightness',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Brightness (float)',
				id: 'float',
				default: '1',
				max: 1,
				min: 0,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/brightness`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_brightness] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	actions['layer_tint'] = {
		name: 'Layer tint',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				disableAutoExpression: true,
				id: 'channel',
				label: 'Channel:',
				default: 'r',
				choices: choices.TINT,
			},
			{
				type: 'textinput',
				label: 'Tint (float)',
				id: 'float',
				default: '1',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const channel = event.options.channel
			const path = `${base_address}${layer}/tint.${channel}`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_tint] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	actions['layer_speed'] = {
		name: 'Layer speed',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Speed (int)',
				id: 'int',
				default: '0',
				max: 4,
				min: -4,
				regex: '/^[-+]?\\d+$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/speed`
			const int = parseWholeInt(event.options.int)
			if (int === null) {
				this.log('error', `[layer_speed] Enter a whole number: ${event.options.int}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: int,
				},
			])
		},
	}
	actions['layer_mode'] = {
		name: 'Layer mode',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				disableAutoExpression: true,
				id: 'int',
				label: 'Mode:',
				default: '1',
				choices: choices.MODE,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/mode`
			const int = parseWholeInt(event.options.int)
			if (int === null) {
				this.log('error', `[layer_mode] Enter a whole number: ${event.options.int}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: int,
				},
			])
		},
	}
	actions['layer_at_end_point'] = {
		name: 'Layer at end point',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				disableAutoExpression: true,
				id: 'int',
				label: 'At end point:',
				default: '0',
				choices: choices.AT_END_POINT,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/at_end_point`
			const int = parseWholeInt(event.options.int)
			if (int === null) {
				this.log('error', `[layer_at_end_point] Enter a whole number: ${event.options.int}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: int,
				},
			])
		},
	}
	actions['layer_transition_time'] = {
		name: 'Layer transition time',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Transition time (int):',
				id: 'int',
				default: '0',
				max: 10,
				min: 0,
				regex: '/^[-+]?\\d+$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/transition_time`
			const int = parseWholeInt(event.options.int)
			if (int === null) {
				this.log('error', `[layer_transition_time] Enter a whole number: ${event.options.int}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: int,
				},
			])
		},
	}
	actions['layer_volume'] = {
		name: 'Layer volume',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Volume (float):',
				id: 'float',
				default: '1',
				max: 1,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/volume`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_volume] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	actions['layer_brightness_shift'] = {
		name: 'Layer brightness (shift)',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Brightness (shift) (float):',
				id: 'float',
				default: '0',
				max: 1,
				min: -1,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/brightness_(shift)`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_brightness_shift] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	actions['layer_contrast_scale'] = {
		name: 'Layer contrast scale',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Contrast scale (float):',
				id: 'float',
				default: '1',
				max: 2,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/contrast_(scale)`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_contrast_scale] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	actions['layer_saturation_scale'] = {
		name: 'Layer saturation scale',
		options: [
			{
				type: 'textinput',
				label: 'Base address:',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name:',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Saturation scale (float):',
				id: 'float',
				default: '1',
				max: 4,
				min: 0,
				step: 0.01,
				regex: '/^[-+]?\\d*\\.?\\d+(e[-+]?\\d+)?$|^\\$\\(.+\\)$/',
				allowInvalidValues: true,
				useVariables: true,
			},
		],
		callback: (event) => {
			const base_address = event.options.base_address
			const layer = event.options.layer_name
			const path = `${base_address}${layer}/saturation_scale`
			const float = parseWholeFloat(event.options.float)
			if (float === null) {
				this.log('error', `[layer_saturation_scale] Enter a number: ${event.options.float}`)
				return
			}
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: float,
				},
			])
		},
	}
	// user-defined custom OSC action
	actions['custom_osc'] = {
		name: 'Send custom OSC message',
		options: [
			{
				type: 'textinput',
				label: 'OSC Path',
				id: 'osc_path',
				default: '/d3/custom/path',
				useVariables: true,
				regex: '/^\\/.+|^\\$\\(.+\\)$/', // a path starting with '/', or a variable
				allowInvalidValues: true,
				tooltip: 'OSC path, e.g. /d3/custom/path. Supports variables.',
			},
			{
				type: 'dropdown',
				disableAutoExpression: true,
				label: 'Argument Type',
				id: 'arg_type',
				default: 'string',
				choices: [
					{ id: 'string', label: 'String' },
					{ id: 'int', label: 'Integer' },
					{ id: 'float', label: 'Float' },
					{ id: 'int_parts', label: 'Integer parts, e.g. 1.2.5' },
					{ id: 'none', label: 'No arguments' },
				],
			},
			{
				type: 'textinput',
				label: 'Argument Value',
				id: 'arg_value',
				default: '',
				useVariables: true,
				regex: '/.*/', // checked when sent, as the type decides what is valid
				allowInvalidValues: true,
				tooltip: 'Value to send. Supports variables.',
				isVisibleExpression: "$(options:arg_type) != 'none'",
			},
		],
		callback: (action) => {
			const path = action.options.osc_path
			const value = action.options.arg_value
			// Validate path
			if (!/^\/.+/.test(path)) {
				this.log('error', '[custom_osc] Invalid OSC path: ' + path)
				return
			}
			const args = customOscArgs(action.options.arg_type, value)
			if (args.error) {
				this.log('error', '[custom_osc] ' + args.error)
				return
			}
			this.sendOscMessage(path, args)
		},
	}
	this.setActionDefinitions(actions)
}

const { Regex } = require('@companion-module/base')
const choices = require('./choices')
const utils = require('./utils')

exports.initActions = function () {
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
			self.checkfeedbacks()
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
			this.sendOscMessage(path, [
				{
					type: 's',
					value: '' + event.options.string,
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
				default: 1,
				regex: /^[-+]?\d+$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (action, context) => {
			const path = `${showcontrol_base_address}trackid`
			let intStr = action.options.int
			if (context && context.parseVariablesInString) {
				intStr = await context.parseVariablesInString(intStr)
				this.log('debug', `[trackid] parsed variable: ${intStr}`)
			} else {
				this.log('debug', `[trackid] using raw value: ${intStr}`)
			}
			const intVal = parseInt(intStr)
			this.log('debug', `[trackid] final int value: ${intVal}`)
			if (isNaN(intVal)) {
				this.log('debug', '[trackid] Not a number, aborting')
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
				label: 'Cue (integer or variable)',
				id: 'int',
				default: 1,
				// Accepts either a signed number or a variable pattern
				regex: /^[-+]?\d+$|^\$\(.+\)$/,
				useVariables: true,
				tooltip: 'Enter an integer or a variable that resolves to an integer.',
				error: 'Please enter a valid integer or variable that resolves to an integer.',
			},
		],
		callback: async (action, context) => {
			const path = `${showcontrol_base_address}cue`
			// Always resolve variables using parseVariablesInString for compatibility
			let intStr = action.options.int
			if (context && context.parseVariablesInString) {
				intStr = await context.parseVariablesInString(intStr)
				this.log('debug', `[cue] parsed variable: ${intStr}`)
			} else {
				this.log('debug', `[cue] using raw value: ${intStr}`)
			}
			const intVal = parseInt(intStr)
			this.log('debug', `[cue] final int value: ${intVal}`)
			if (isNaN(intVal)) {
				this.log('debug', '[cue] Not a number, aborting')
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
	actions['floatcue'] = {
		name: 'Float Cue',
		options: [
			{
				type: 'textinput',
				label: 'Float Cue (float or variable)',
				id: 'float',
				default: 1.0,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
				tooltip: 'Enter a float or a variable that resolves to a float.',
				error: 'Please enter a valid float or variable that resolves to a float.',
			},
		],
		callback: async (action, context) => {
			const path = `${showcontrol_base_address}floatcue`
			let floatStr = action.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
			}
			const floatVal = parseFloat(floatStr)
			if (isNaN(floatVal)) {
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[shift_brightness] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[shift_brightness] using raw value: ${floatStr}`)
			}
			const brightness = this.getVariableValue('brightness')
			let new_brightness = utils.shift
				? utils.decrement_float(brightness, floatStr)
				: utils.increment_float(brightness, floatStr)
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[increment_brightness] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[increment_brightness] using raw value: ${floatStr}`)
			}
			const brightness = this.getVariableValue('brightness')
			const new_brightness = utils.increment_float(brightness, floatStr)
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[decrement_brightness] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[decrement_brightness] using raw value: ${floatStr}`)
			}
			const brightness = this.getVariableValue('brightness')
			let new_brightness = utils.decrement_float(brightness, floatStr)
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[shift_volume] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[shift_volume] using raw value: ${floatStr}`)
			}
			const volume = this.getVariableValue('volume')
			let new_volume = utils.shift ? utils.decrement_float(volume, floatStr) : utils.increment_float(volume, floatStr)
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[increment_volume] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[increment_volume] using raw value: ${floatStr}`)
			}
			const volume = this.getVariableValue('volume')
			const new_volume = utils.increment_float(volume, floatStr)
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
				default: 0.01,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event, context) => {
			let floatStr = event.options.float
			if (context && context.parseVariablesInString) {
				floatStr = await context.parseVariablesInString(floatStr)
				this.log('debug', `[decrement_volume] parsed variable: ${floatStr}`)
			} else {
				this.log('debug', `[decrement_volume] using raw value: ${floatStr}`)
			}
			const volume = this.getVariableValue('volume')
			const new_volume = utils.decrement_float(volume, floatStr)
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
				id: 'mode',
				label: 'Blendmode:',
				default: '00',
				choices: choices.BLENDMODE,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/blendmode`
			const int = await this.parseVariablesInString(event.options.mode)

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
				default: 1,
				max: 1,
				min: 0,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/brightness`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				id: 'channel',
				label: 'Channel:',
				default: 'r',
				choices: choices.TINT,
			},
			{
				type: 'textinput',
				label: 'Tint (float)',
				id: 'float',
				default: 1,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const channel = await this.parseVariablesInString(event.options.channel)
			const path = `${base_address}${layer}/tint.${channel}`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				default: 0,
				max: 4,
				min: -4,
				regex: /^[-+]?\d+$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/speed`
			const int = await this.parseVariablesInString(event.options.int)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseInt(int),
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
				id: 'int',
				label: 'Mode:',
				default: '1',
				choices: choices.MODE,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/mode`
			const int = await this.parseVariablesInString(event.options.int)
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
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
				id: 'int',
				label: 'At end point:',
				default: '0',
				choices: choices.AT_END_POINT,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/at_end_point`
			const int = await this.parseVariablesInString(event.options.int)
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
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
				default: 0,
				max: 10,
				min: 0,
				regex: /^[-+]?\d+$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/transition_time`
			const int = await this.parseVariablesInString(event.options.int)
			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
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
				default: 1,
				max: 1,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/volume`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				default: 0,
				max: 1,
				min: -1,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/brightness_(shift)`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				default: 1,
				max: 2,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/contrast_(scale)`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				default: 1,
				max: 4,
				min: 0,
				step: 0.01,
				regex: /^[-+]?\d*\.?\d+(e[-+]?\d+)?$|^\$\(.+\)$/,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const path = `${base_address}${layer}/saturation_scale`
			const float = await this.parseVariablesInString(event.options.float)
			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
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
				regex: /^\/.+/, // must start with '/'
				tooltip: 'OSC path, e.g. /d3/custom/path. Supports variables.',
			},
			{
				type: 'dropdown',
				label: 'Argument Type',
				id: 'arg_type',
				default: 'string',
				choices: [
					{ id: 'string', label: 'String' },
					{ id: 'int', label: 'Integer' },
					{ id: 'float', label: 'Float' },
				],
			},
			{
				type: 'textinput',
				label: 'Argument Value',
				id: 'arg_value',
				default: '',
				useVariables: true,
				regex: /.*/, // backend validation only
				tooltip: 'Value to send. Supports variables.',
			},
		],
		callback: async (action, context) => {
			// Resolve variables
			let path = action.options.osc_path
			let value = action.options.arg_value
			if (context && context.parseVariablesInString) {
				path = await context.parseVariablesInString(path)
				value = await context.parseVariablesInString(value)
			}
			// Validate path
			if (!/^\/.+/.test(path)) {
				this.log('error', '[custom_osc] Invalid OSC path: ' + path)
				return
			}
			// Type conversion
			let argType = action.options.arg_type
			let oscArg = { type: 's', value: value }
			if (argType === 'int') {
				const intVal = parseInt(value)
				if (isNaN(intVal)) {
					this.log('error', '[custom_osc] Argument is not a valid integer: ' + value)
					return
				}
				oscArg = { type: 'i', value: intVal }
			} else if (argType === 'float') {
				const floatVal = parseFloat(value)
				if (isNaN(floatVal)) {
					this.log('error', '[custom_osc] Argument is not a valid float: ' + value)
					return
				}
				oscArg = { type: 'f', value: floatVal }
			}
			// Send OSC message
			this.sendOscMessage(path, [oscArg])
		},
	}
	this.setActionDefinitions(actions)
}

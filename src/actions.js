const { Regex } = require('@companion-module/base')
const utils = require('./utils')

exports.initActions = function () {
	let self = this
	let actions = {}

	let showcontrol_base_address = '/d3/showcontrol/'
	let layer_base_address = '/d3/layer/'

	// utility actions
	actions['shift'] = {
		name: 'Shift',
		options: [],
		callback: (action) => {
			utils.shift = !utils.shift
			self.checkfeedbacks()
		},
	}
	// showcontrol actions
	actions['play'] = {
		name: 'Play',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}play`

			this.sendOscMessage(path, [])
		},
	}
	actions['playsection'] = {
		name: 'Play to end of section',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}playsection`

			this.sendOscMessage(path, [])
		},
	}
	actions['loopsection'] = {
		name: 'Loop section',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}loop`

			this.sendOscMessage(path, [])
		},
	}
	actions['stop'] = {
		name: 'Stop',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}stop`

			this.sendOscMessage(path, [])
		},
	}
	actions['previoussection'] = {
		name: 'Previous section',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}previoussection`

			this.sendOscMessage(path, [])
		},
	}
	actions['nextsection'] = {
		name: 'Next section',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}nextsection`

			this.sendOscMessage(path, [])
		},
	}
	actions['returntostart'] = {
		name: 'Return to start',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}returntostart`

			this.sendOscMessage(path, [])
		},
	}
	actions['previoustrack'] = {
		name: 'Previous track',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}previoustrack`

			this.sendOscMessage(path, [])
		},
	}
	actions['nexttrack'] = {
		name: 'Next track',
		options: [],
		callback: (action) => {
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
		callback: async (event) => {
			const path = `${showcontrol_base_address}trackname`
			const string = await this.parseVariablesInString(event.options.string)

			this.sendOscMessage(path, [
				{
					type: 's',
					value: '' + string,
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
				regex: Regex.SIGNED_NUMBER,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const path = `${showcontrol_base_address}trackid`
			const int = await this.parseVariablesInString(event.options.int)

			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
				},
			])
		},
	}
	actions['cue'] = {
		name: 'Cue',
		options: [
			{
				type: 'number',
				label: 'Cue (integer)',
				id: 'int',
				default: 1,
				regex: Regex.SIGNED_NUMBER,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const path = `${showcontrol_base_address}cue`
			const int = await this.parseVariablesInString(event.options.int)

			this.sendOscMessage(path, [
				{
					type: 'i',
					value: parseInt(int),
				},
			])
		},
	}
	actions['floatcue'] = {
		name: 'Float cue',
		options: [
			{
				type: 'static-text',
				label: '*** important ***',
				id: 'important-line',
				value:
					'Requires xx.yy format in disguise tag value e.g. 1.1 entered here will only trigger disguise if cue is set to 01.10',
			},
			{
				type: 'number',
				label: 'Cue (float)',
				id: 'float',
				default: '1.1',
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const path = `${showcontrol_base_address}floatcue`
			const float = await this.parseVariablesInString(event.options.float)

			this.sendOscMessage(path, [
				{
					type: 'f',
					value: parseFloat(float),
				},
			])
		},
	}
	actions['fadeup'] = {
		name: 'Fade up',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}fadeup`

			this.sendOscMessage(path, [])
		},
	}
	actions['fadedown'] = {
		name: 'Fade down',
		options: [],
		callback: (action) => {
			const path = `${showcontrol_base_address}fadedown`

			this.sendOscMessage(path, [])
		},
	}
	actions['hold'] = {
		name: 'Hold',
		options: [],
		callback: (action) => {
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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const brightness = this.getVariableValue('brightness')

			let new_brightness = utils.shift
				? utils.decrement_float(brightness, float)
				: utils.increment_float(brightness, float)

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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const brightness = this.getVariableValue('brightness')
			const new_brightness = utils.increment_float(brightness, float)
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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const brightness = this.getVariableValue('brightness')
			const new_brightness = utils.decrement_float(brightness, float)
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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const volume = this.getVariableValue('volume')

			let new_volume = utils.shift ? utils.decrement_float(volume, float) : utils.increment_float(volume, float)

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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const volume = this.getVariableValue('volume')
			const new_volume = utils.increment_float(volume, float)
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
				regex: Regex.SIGNED_FLOAT,
				useVariables: true,
			},
		],
		callback: async (event) => {
			const float = await this.parseVariablesInString(event.options.float)
			const volume = this.getVariableValue('volume')
			const new_volume = utils.decrement_float(volume, float)
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				id: 'mode',
				label: 'Blendmode :',
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Brightness (float)',
				id: 'float',
				default: 1,
				max: 1,
				min: 0,
				regex: Regex.SIGNED_FLOAT,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				id: 'channel',
				label: 'Channel :',
				default: 'r',
				choices: choices.TINT,
			},
			{
				type: 'number',
				label: 'Tint (float)',
				id: 'float',
				default: 1,
				max: 1,
				min: 0,
				step: 0.01,
				regex: Regex.SIGNED_FLOAT,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Speed (int)',
				id: 'int',
				default: 0,
				max: 4,
				min: -4,
				regex: Regex.SIGNED_NUMBER,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				id: 'int',
				label: 'Mode :',
				default: '1',
				choices: choices.MODE,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const channel = await this.parseVariablesInString(event.options.channel)
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'dropdown',
				id: 'int',
				label: 'At end point :',
				default: '0',
				choices: choices.AT_END_POINT,
			},
		],
		callback: async (event) => {
			const base_address = await this.parseVariablesInString(event.options.base_address)
			const layer = await this.parseVariablesInString(event.options.layer_name)
			const channel = await this.parseVariablesInString(event.options.channel)
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Transition time (int) :',
				id: 'int',
				default: 0,
				max: 10,
				min: 0,
				regex: Regex.SIGNED_NUMBER,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Volume (float) :',
				id: 'float',
				default: 1,
				max: 1,
				min: 0,
				step: 0.01,
				regex: Regex.SIGNED_FLOAT,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Brightness (shift) (float) :',
				id: 'float',
				default: 0,
				max: 1,
				min: -1,
				step: 0.01,
				regex: Regex.SIGNED_FLOAT,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Contrast scale (float) :',
				id: 'float',
				default: 1,
				max: 2,
				min: 0,
				step: 0.01,
				regex: Regex.SIGNED_FLOAT,
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
				label: 'Base address :',
				id: 'base_address',
				default: layer_base_address,
				useVariables: true,
			},
			{
				type: 'textinput',
				label: 'Layer name :',
				id: 'layer_name',
				default: 'video',
				useVariables: true,
			},
			{
				type: 'number',
				label: 'Saturation scale (float) :',
				id: 'float',
				default: 1,
				max: 4,
				min: 0,
				step: 0.01,
				regex: Regex.SIGNED_FLOAT,
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

	this.setActionDefinitions(actions)
}

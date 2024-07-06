const { InstanceBase, Regex, runEntrypoint, combineRgb } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')

const oscListener = require('./oscReceiver.js')
const choices = require('./choices')

let PLAYMODE

class disguiseOSCInstance extends InstanceBase {
	variable_array = [
		{ variableId: 'heartbeat', name: 'heartbeat' },
		{ variableId: 'trackposition', name: 'trackposition' },
		{ variableId: 'trackposition_hh', name: 'trackposition_hh' },
		{ variableId: 'trackposition_mm', name: 'trackposition_mm' },
		{ variableId: 'trackposition_ss', name: 'trackposition_ss' },
		{ variableId: 'trackposition_ff', name: 'trackposition_ff' },
		{ variableId: 'trackname', name: 'trackname' },
		{ variableId: 'trackid', name: 'trackid' },
		{ variableId: 'currentSectionName', name: 'currentSectionName' },
		{ variableId: 'nextSectionName', name: 'nextSectionName' },
		{ variableId: 'sectionHint', name: 'sectionHint' },
		{ variableId: 'sectionElapsed', name: 'current section time elapsed' },
		{ variableId: 'sectionRemaining', name: 'current section time remaining' },
		{ variableId: 'volume', name: 'volume' },
		{ variableId: 'brightness', name: 'brightness' },
		{ variableId: 'bpm', name: 'bpm' },
		{ variableId: 'playMode', name: 'playMode' },
	]

	constructor(internal) {
		super(internal)
	}

	feedbacks = {
		PlayMode: {
			name: 'Indicate playmode',
			type: 'boolean',
			description: 'Blinks background if selected playmode is active',
			defaultStyle: {
				bgcolor: combineRgb(0, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Playmode :',
					default: '00',
					choices: choices.PLAYMODE,
				},
			],
			callback: (feedback) => {
				if (this.PLAYMODE === feedback.options.mode && this.blink_button) {
					return true
				} else {
					return false
				}
			},
		},
	}

	async init(config) {
		this.config = config

		oscListener.connect(this)

		this.updateStatus('ok')
		this.setVariableDefinitions(this.variable_array) // export variable definitions
		this.updateActions() // export actions
		this.setFeedbackDefinitions(this.feedbacks)

		this.blink_button = setInterval(() => {
			this.blink_button = !this.blink_button

			this.checkFeedbacks('PlayMode')
		}, 333)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				default: '192.168.23.216',
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'send_port',
				label: 'Send Port',
				width: 3,
				default: 7401,
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'recieve_port',
				label: 'Receive Port',
				width: 3,
				default: 7400,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		const sendOscMessage = (path, args) => {
			this.log('debug', `Sending OSC ${this.config.host}:${this.config.send_port} ${path}`)
			this.log('debug', `Sending Args ${JSON.stringify(args)}`)
			this.oscSend(this.config.host, this.config.send_port, path, args)
		}
		const layer_base_address = '/d3/layer/'

		this.setActionDefinitions({
			play: {
				name: 'Play',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/play'

					sendOscMessage(path, [])
				},
			},
			playsection: {
				name: 'Play to end of section',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/playsection'

					sendOscMessage(path, [])
				},
			},
			loopsection: {
				name: 'Loop section',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/loop'

					sendOscMessage(path, [])
				},
			},
			stop: {
				name: 'Stop',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/stop'

					sendOscMessage(path, [])
				},
			},
			previoussection: {
				name: 'Previous section',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/previoussection'

					sendOscMessage(path, [])
				},
			},
			nextsection: {
				name: 'Next section',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/nextsection'

					sendOscMessage(path, [])
				},
			},
			returntostart: {
				name: 'Return to start',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/returntostart'

					sendOscMessage(path, [])
				},
			},
			previoustrack: {
				name: 'Previous track',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/previoustrack'

					sendOscMessage(path, [])
				},
			},
			nexttrack: {
				name: 'Next track',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/nexttrack'

					sendOscMessage(path, [])
				},
			},
			trackname: {
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
					const path = '/d3/showcontrol/trackname'
					const string = await this.parseVariablesInString(event.options.string)

					sendOscMessage(path, [
						{
							type: 's',
							value: '' + string,
						},
					])
				},
			},
			trackid: {
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
					const path = '/d3/showcontrol/trackid'
					const int = await this.parseVariablesInString(event.options.int)

					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			cue: {
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
					const path = '/d3/showcontrol/cue'
					const int = await this.parseVariablesInString(event.options.int)

					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			floatcue: {
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
					const path = '/d3/showcontrol/floatcue'
					const float = await this.parseVariablesInString(event.options.float)

					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			fadeup: {
				name: 'Fade up',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/fadeup'

					sendOscMessage(path, [])
				},
			},
			fadedown: {
				name: 'Fade down',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/fadedown'

					sendOscMessage(path, [])
				},
			},
			hold: {
				name: 'Hold',
				options: [],
				callback: (action) => {
					const path = '/d3/showcontrol/hold'

					sendOscMessage(path, [])
				},
			},
			volume: {
				name: 'Volume',
				options: [
					{
						type: 'number',
						label: 'Volume (float)',
						id: 'float',
						default: 1,
						max: 1,
						min: 0,
						regex: Regex.SIGNED_FLOAT,
						useVariables: true,
					},
				],
				callback: async (event) => {
					const path = '/d3/showcontrol/volume'
					const float = await this.parseVariablesInString(event.options.float)

					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			brightness: {
				name: 'Brightness',
				options: [
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
					const path = '/d3/showcontrol/brightness'
					const float = await this.parseVariablesInString(event.options.float)

					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_blendmode: {
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

					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			layer_brightness: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_tint: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_speed: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseInt(int),
						},
					])
				},
			},
			layer_mode: {
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
					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			layer_at_end_point: {
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
					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			layer_transition_time: {
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
					sendOscMessage(path, [
						{
							type: 'i',
							value: parseInt(int),
						},
					])
				},
			},
			layer_volume: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_brightness_shift: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_contrast_scale: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
			layer_saturation_scale: {
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
					sendOscMessage(path, [
						{
							type: 'f',
							value: parseFloat(float),
						},
					])
				},
			},
		})
	}
}

runEntrypoint(disguiseOSCInstance, UpgradeScripts)

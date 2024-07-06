const { InstanceBase, Regex, runEntrypoint, combineRgb } = require('@companion-module/base')
const osc = require('osc')
const UpgradeScripts = require('./upgrades')

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
					choices: choices.CHOICES_PLAYMODE,
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

		this.init_osc()
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
						default: 'vid',
						useVariables: true,
					},
					{
						type: 'dropdown',
						id: 'mode',
						label: 'Blendmode :',
						default: '00',
						choices: choices.CHOICES_BLENDMODE,
					},
				],
				callback: async (event) => {
					const base_address = await this.parseVariablesInString(event.options.base_address)
					const layer = await this.parseVariablesInString(event.options.layer_name)
					const path = `${base_address}${layer}/blendmode`
					const int = await this.parseVariablesInString(event.options.mode)
					this.log('debug', path + ' ' + int)

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
						default: 'vid',
						useVariables: true,
					},
					{
						type: 'number',
						label: 'Brightness (float)',
						id: 'float',
						default: 1,
						regex: Regex.SIGNED_FLOAT,
						useVariables: true,
					},
				],
				callback: async (event) => {
					const base_address = await this.parseVariablesInString(event.options.base_address)
					const layer = await this.parseVariablesInString(event.options.layer_name)
					const path = `${base_address}${layer}/brightness`
					const float = await this.parseVariablesInString(event.options.float)
					this.log('debug', path + ' ' + float)

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

	init_osc() {
		if (this.connecting) {
			return
		}

		if (this.config.host) {
			this.receiver = new osc.UDPPort({
				localAddress: '0.0.0.0',
				localPort: this.config.recieve_port,
				address: this.config.host,
				port: this.config.recieve_port,
				metadata: true,
			})
			this.connecting = true

			this.receiver.open()

			this.receiver.on('error', (err) => {
				console.log('debug', err)
				this.log('error', 'Error: ' + err.message)
				this.connecting = false
				if (err.code == 'ECONNREFUSED') {
					this.receiver.removeAllListeners()
				}
			})

			this.receiver.on('close', () => {
				this.log('error', 'Connection to disguise closed')
				this.connecting = false
				this.status(this.STATUS_WARNING, 'CLOSED')
			})

			this.receiver.on('ready', () => {
				this.connecting = false
				this.log('info', 'Connected to disguise:' + this.config.host)
			})

			this.receiver.on('message', (message) => {
				this.processMessage(message)
			})
		}
	}

	processMessage(message) {
		if (message.address === '/d3/showcontrol/heartbeat') {
			if (message.args.length > 0) {
				let heartbeat = message.args[0].value.toFixed(2)
				this.setVariableValues({
					heartbeat: heartbeat,
				})

				this.checkFeedbacks('Heartbeat')
			}
		} else if (message.address === '/d3/showcontrol/trackposition') {
			if (message.args.length > 0) {
				var trackPos = message.args[0].value
				this.setVariableValues({
					trackposition: trackPos,
				})
				var hh = trackPos.slice(0, 2) // split timecode - hours
				this.setVariableValues({
					trackposition_hh: hh,
				})
				var trackpos_mm = trackPos.slice(3, 5) // split timecode - minutes
				this.setVariableValues({
					trackposition_mm: trackpos_mm,
				})
				var trackpos_ss = trackPos.slice(6, 8) // split timecode - minutes
				this.setVariableValues({
					trackposition_ss: trackpos_ss,
				})
				var trackpos_ff = trackPos.slice(9, 11) // split timecode - minutes
				this.setVariableValues({
					trackposition_ff: trackpos_ff,
				})
			}
		} else if (message.address === '/d3/showcontrol/trackname') {
			if (message.args.length > 0) {
				var trackName = message.args[0].value
				this.setVariableValues({
					trackname: trackName,
				})
			}
		} else if (message.address === '/d3/showcontrol/trackid') {
			if (message.args.length > 0) {
				var trackID = message.args[0].value
				this.setVariableValues({
					trackid: trackID,
				})
			}
		} else if (message.address === '/d3/showcontrol/currentsectionname') {
			if (message.args.length > 0) {
				var currentSectionName = message.args[0].value
				this.setVariableValues({
					currentSectionName: currentSectionName,
				})
			}
		} else if (message.address === '/d3/showcontrol/nextsectionname') {
			if (message.args.length > 0) {
				var nextSectionName = message.args[0].value
				this.setVariableValues({
					nextSectionName: nextSectionName,
				})
			}
		} else if (message.address === '/d3/showcontrol/sectionhint') {
			if (message.args.length > 0) {
				var sectionHint = message.args[0].value
				this.setVariableValues({
					sectionHint: sectionHint,
				})
				var sectionElapsed = sectionHint.match(/\+\d{2}:\d{2}:\d{2}\.\d{2}/)
				this.setVariableValues({
					sectionElapsed: sectionElapsed,
				})
				var sectionRemaining = sectionHint.match(/\-\d{2}:\d{2}:\d{2}\.\d{2}/)
				this.setVariableValues({
					sectionRemaining: sectionRemaining,
				})
			}
		} else if (message.address === '/d3/showcontrol/volume') {
			if (message.args.length > 0) {
				var volume = message.args[0].value
				this.setVariableValues({
					volume: volume.toFixed(2) * 100, // volume in %
				})
			}
		} else if (message.address === '/d3/showcontrol/brightness') {
			if (message.args.length > 0) {
				var brightness = message.args[0].value
				this.setVariableValues({
					brightness: brightness.toFixed(2) * 100, // brightness in %
				})
			}
		} else if (message.address === '/d3/showcontrol/bpm') {
			if (message.args.length > 0) {
				var bpm = message.args[0].value
				this.setVariableValues({
					bpm: bpm,
				})
			}
		} else if (message.address === '/d3/showcontrol/playmode') {
			if (message.args.length > 0) {
				var playMode = message.args[0].value
				this.setVariableValues({
					playMode: playMode,
				})
				if (playMode.valueOf() === 'Play') {
					this.PLAYMODE = '00'
				} else if (playMode.valueOf() === 'PlaySection') {
					this.PLAYMODE = '01'
				} else if (playMode.valueOf() === 'LoopSection') {
					this.PLAYMODE = '02'
				} else if (playMode.valueOf() === 'Stop') {
					this.PLAYMODE = '03'
				} else if (playMode.valueOf() === 'HoldSection') {
					this.PLAYMODE = '04'
				} else if (playMode.valueOf() === 'HoldEnd') {
					this.PLAYMODE = '05'
				}
			}
		}
	}
}

runEntrypoint(disguiseOSCInstance, UpgradeScripts)

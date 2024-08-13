const { InstanceBase, Regex, runEntrypoint, combineRgb } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')

const osc_server = require('./osc_server.js')
const choices = require('./choices')
const utils = require('./utils')
const actions = require('./actions')
const presets = require('./presets')
const feedbacks = require('./feedbacks')
const variables = require('./variables')

class disguiseOSCInstance extends InstanceBase {
	constructor(internal) {
		
				super(internal)

		Object.assign(this, {
			...actions,
			...presets,
			...feedbacks,
			...variables,
		})

		this.updateStatus('Disconnected')
	}

	async init(config, firstInit) {
		let self = this

		this.config = config

		self.initActions()
		self.initPresets()
		self.initFeedbacks()
		self.initVariables()

		osc_server.connect(this)
		this.updateStatus('ok')

		this.blink_button = setInterval(() => {
			this.blink_button = !this.blink_button

			this.checkFeedbacks()
		}, 500)

		await this.configUpdated(config)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		osc_server.close(this)
		delete osc_server(this)
	}

	async configUpdated(config) {
		this.log('debug', 'config updated')
		osc_server.close(this)

		this.config = config

		osc_server.connect(this)
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				id: 'host',
				type: 'textinput',
				label: 'Target IP',
				width: 6,
				default: '192.168.23.216',
				regex: Regex.IP,
			},
			{
				id: 'send_port',
				type: 'textinput',
				label: 'Send Port',
				width: 3,
				default: 7401,
				regex: Regex.PORT,
			},
			{
				id: 'recieve_port',
				type: 'textinput',
				label: 'Receive Port',
				width: 3,
				default: 7400,
				regex: Regex.PORT,
			},
		]
	}
	sendOscMessage(path, args) {
		this.log('debug', `Sending OSC ${this.config.host}:${this.config.send_port} ${path}`)
		this.log('debug', `Sending Args ${JSON.stringify(args)}`)
		this.oscSend(this.config.host, this.config.send_port, path, args)
	}
}

runEntrypoint(disguiseOSCInstance, UpgradeScripts)

import { InstanceBase, Regex, createModuleLogger } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'

import osc_server from './osc_server.js'
import * as actions from './actions.js'
import * as presets from './presets.js'
import * as feedbacks from './feedbacks.js'
import * as variables from './variables.js'

export { UpgradeScripts }

export default class disguiseOSCInstance extends InstanceBase {
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

	async init(config) {
		let self = this

		this.config = config

		self.initActions()
		self.initFeedbacks()
		self.initPresets()
		self.initVariables()

		osc_server.connect(this)

		this.blink_button = true
		this.blinkInterval = setInterval(() => {
			this.blink_button = !this.blink_button

			this.checkAllFeedbacks()
		}, 500)
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		clearInterval(this.blinkInterval)
		await osc_server.close()
	}

	async configUpdated(config) {
		this.log('debug', 'config updated')
		await osc_server.close()

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
				default: '7401',
				regex: Regex.PORT,
			},
			{
				id: 'recieve_port',
				type: 'textinput',
				label: 'Receive Port',
				width: 3,
				default: '7400',
				regex: Regex.PORT,
			},
		]
	}
	// Companion's debug log shows base 2.x lines with no source unless the logger is named
	log(level, message) {
		createModuleLogger(this.label)[level](message)
	}

	sendOscMessage(path, args) {
		this.log('debug', `Sending OSC ${this.config.host}:${this.config.send_port} ${path}`)
		this.log('debug', `Sending Args ${JSON.stringify(args)}`)
		this.oscSend(this.config.host, Number(this.config.send_port), path, args)
	}
}

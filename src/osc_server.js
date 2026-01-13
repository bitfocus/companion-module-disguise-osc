const osc = require('osc')
const { InstanceStatus } = require('@companion-module/base')
const utils = require('./utils')

const osc_server = {
	lastHeartbeat: null,
	// Buffer to store latest args for each OSC address
	received: {},

	close: async function () {
		await this.udpPort.close()
	},

	connect: async function (self) {
		// Expose buffer on self for access in feedbacks and actions
		if (!self.oscReceived) self.oscReceived = {}
		this.udpPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort: self.config.recieve_port,
			metadata: true,
		})

		this.udpPort.open()

		this.udpPort.on('ready', () => {
			self.updateStatus(InstanceStatus.Ok, 'Connected.')

			self.log('info', `Listening for disguise showcontrol messages on port ${self.config.recieve_port}`)
		})

		this.udpPort.on('message', (oscMsg) => {
			// Store latest args for this address in both osc_server and instance buffer
			this.received[oscMsg.address] = oscMsg.args
			self.oscReceived[oscMsg.address] = oscMsg.args
			// Debug log for buffer
			// if (self.log) {
			// 	self.log('debug', `[oscReceived] ${oscMsg.address}: ${JSON.stringify(oscMsg.args)}`)
			// } else {
			// 	console.log('[oscReceived]', oscMsg.address, oscMsg.args)
			// }
			utils.processMessage(oscMsg, self)
		})

		this.udpPort.on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				self.log('error', 'Error: Selected port in use.' + err.message)
				self.updateStatus(
					InstanceStatus.ConnectionFailure,
					`Port ${self.config.localrecieve_portport} in use elsewhere.`,
				)
			} else {
				self.log('error', 'Error: UDP port error: ' + err.message)
				self.updateStatus(InstanceStatus.UnknownError, err.message)
			}
		})
	},

	// Helper to get last value(s) for an OSC address
	getLastValueForAddress: function (address) {
		return this.received[address]
	},
}

module.exports = osc_server

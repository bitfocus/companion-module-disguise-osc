const osc = require('osc')
const { InstanceStatus } = require('@companion-module/base')
const utils = require('./utils')

const osc_server = {
	lastHeartbeat: null,

	close: async function () {
		await this.udpPort.close()
	},

	connect: async function (self) {
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
			utils.processMessage(oscMsg, self)
			self.updateStatus(InstanceStatus.Ok, 'Connected.')
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
}

module.exports = osc_server

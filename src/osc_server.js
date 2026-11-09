import { once } from 'node:events'
import osc from 'osc'
import { InstanceStatus } from '@companion-module/base'
import utils from './utils.js'

// A UDP bind doesn't reject a bad port. It picks a random one or wraps the number, then reports success.
function parsePort(value) {
	const text = String(value ?? '').trim()
	if (!/^\d+$/.test(text)) return null
	const port = Number(text)
	return port >= 1 && port <= 65535 ? port : null
}

const osc_server = {
	lastHeartbeat: null,
	// Buffer to store latest args for each OSC address
	received: {},

	close: async function () {
		const port = this.udpPort
		this.udpPort = undefined
		if (!port?.socket) return

		const closed = once(port.socket, 'close')
		port.close()
		await closed
	},

	connect: async function (self) {
		// Expose buffer on self for access in feedbacks and actions
		if (!self.oscReceived) self.oscReceived = {}

		const localPort = parsePort(self.config.recieve_port)
		if (localPort === null) {
			self.log('error', `[receiver] Receive port "${self.config.recieve_port}" is not a whole number from 1 to 65535.`)
			self.updateStatus(InstanceStatus.BadConfig, 'Receive port must be a whole number from 1 to 65535.')
			return
		}

		this.udpPort = new osc.UDPPort({
			localAddress: '0.0.0.0',
			localPort,
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
				self.updateStatus(InstanceStatus.ConnectionFailure, `Port ${self.config.recieve_port} in use elsewhere.`)
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

export default osc_server

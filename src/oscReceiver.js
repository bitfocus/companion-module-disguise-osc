const osc = require('osc')
const { InstanceStatus, CompanionVariableDefinition, CompanionVariableValues } = require('@companion-module/base')
const choices = require('./choices')

const oscReceiver = {
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

			// Start the interval to check for stopped messages
			if (self.config.listen) {
				self.log('info', `Listening for disguise showcontrol messages on port ${self.config.recieve_port}`)
				this.lastMessageTimestamp = Date.now()
				this.warningInterval = 1000 // Time in milliseconds to trigger warning
				this.monitoringInterval = setInterval(() => this.checkForStoppedMessages(self), this.warningInterval)
			}
		})

		this.udpPort.on('message', (oscMsg) => {
			this.processMessage(oscMsg, self)
			this.lastMessageTimestamp = Date.now() // Update the timestamp of the last received message
			self.updateStatus(InstanceStatus.Ok, 'Connected.')
		})

		this.udpPort.on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				self.log('error', 'Error: Selected port in use.' + err.message)
				self.updateStatus(
					InstanceStatus.ConnectionFailure,
					`Port ${self.config.localrecieve_portport} in use elsewhere.`
				)
			} else {
				self.log('error', 'Error: UDP port error: ' + err.message)
				self.updateStatus(InstanceStatus.UnknownError, err.message)
			}
		})
	},

	checkForStoppedMessages: function (self) {
		const currentTime = Date.now()
		if (currentTime - this.lastMessageTimestamp > this.warningInterval) {
			self.log('warn', 'Warning: No messages received from d3 in over a second.')
			self.updateStatus(InstanceStatus.ConnectionFailure)
			self.setVariableValues({
				heartbeat: false,
			})
		}
	},

	processMessage: function (message, self) {
		if (message.address === '/d3/showcontrol/heartbeat') {
			if (message.args.length > 0) {
				let heartbeat = message.args[0].value
				if (heartbeat > 0) {
					self.setVariableValues({
						heartbeat: true,
					})
				}

				self.checkFeedbacks('Heartbeat')
			}
		} else if (message.address === '/d3/showcontrol/trackposition') {
			if (message.args.length > 0) {
				var trackPos = message.args[0].value
				self.setVariableValues({
					trackposition: trackPos,
				})
				var hh = trackPos.slice(0, 2) // split timecode - hours
				self.setVariableValues({
					trackposition_hh: hh,
				})
				var trackpos_mm = trackPos.slice(3, 5) // split timecode - minutes
				self.setVariableValues({
					trackposition_mm: trackpos_mm,
				})
				var trackpos_ss = trackPos.slice(6, 8) // split timecode - minutes
				self.setVariableValues({
					trackposition_ss: trackpos_ss,
				})
				var trackpos_ff = trackPos.slice(9, 11) // split timecode - minutes
				self.setVariableValues({
					trackposition_ff: trackpos_ff,
				})
			}
		} else if (message.address === '/d3/showcontrol/timecodeposition') {
			if (message.args.length > 0) {
				var timecodePos = message.args[0].value
				self.setVariableValues({
					timecodeposition: timecodePos,
				})
				var hh = timecodePos.slice(0, 2) // split timecode - hours
				self.setVariableValues({
					timecodeposition_hh: hh,
				})
				var timecodePos_mm = timecodePos.slice(3, 5) // split timecode - minutes
				self.setVariableValues({
					timecodeposition_mm: timecodePos_mm,
				})
				var timecodePos_ss = timecodePos.slice(6, 8) // split timecode - minutes
				self.setVariableValues({
					timecodeposition_ss: timecodePos_ss,
				})
				var timecodePos_ff = timecodePos.slice(9, 11) // split timecode - minutes
				self.setVariableValues({
					timecodeposition_ff: timecodePos_ff,
				})
			}
		} else if (message.address === '/d3/showcontrol/trackname') {
			if (message.args.length > 0) {
				var trackName = message.args[0].value
				self.setVariableValues({
					trackname: trackName,
				})
			}
		} else if (message.address === '/d3/showcontrol/trackid') {
			if (message.args.length > 0) {
				var trackID = message.args[0].value
				self.setVariableValues({
					trackid: trackID,
				})
			}
		} else if (message.address === '/d3/showcontrol/currentsectionname') {
			if (message.args.length > 0) {
				var currentSectionName = message.args[0].value
				self.setVariableValues({
					currentSectionName: currentSectionName,
				})
			}
		} else if (message.address === '/d3/showcontrol/nextsectionname') {
			if (message.args.length > 0) {
				var nextSectionName = message.args[0].value
				self.setVariableValues({
					nextSectionName: nextSectionName,
				})
			}
		} else if (message.address === '/d3/showcontrol/sectionhint') {
			if (message.args.length > 0) {
				var sectionHint = message.args[0].value
				self.setVariableValues({
					sectionHint: sectionHint,
				})
				var sectionElapsed = sectionHint.match(/\+\d{2}:\d{2}:\d{2}\.\d{2}/) // section time elapsed
				self.setVariableValues({
					sectionElapsed: sectionElapsed,
				})
				var sectionRemaining = sectionHint.match(/\-\d{2}:\d{2}:\d{2}\.\d{2}/) // section time remaining
				self.setVariableValues({
					sectionRemaining: sectionRemaining,
				})
			}
		} else if (message.address === '/d3/showcontrol/volume') {
			if (message.args.length > 0) {
				var volume = message.args[0].value
				self.setVariableValues({
					volume: volume.toFixed(2) * 100, // volume in %
				})
			}
		} else if (message.address === '/d3/showcontrol/brightness') {
			if (message.args.length > 0) {
				var brightness = message.args[0].value
				self.setVariableValues({
					brightness: brightness.toFixed(2) * 100, // brightness in %
				})
			}
		} else if (message.address === '/d3/showcontrol/bpm') {
			if (message.args.length > 0) {
				var bpm = message.args[0].value
				self.setVariableValues({
					bpm: bpm,
				})
			}
		} else if (message.address === '/d3/showcontrol/playmode') {
			if (message.args.length > 0) {
				var playMode = message.args[0].value
				self.setVariableValues({
					playMode: playMode,
				})
				if (playMode.valueOf() === 'Play') {
					self.PLAYMODE = '00'
				} else if (playMode.valueOf() === 'PlaySection') {
					self.PLAYMODE = '01'
				} else if (playMode.valueOf() === 'LoopSection') {
					self.PLAYMODE = '02'
				} else if (playMode.valueOf() === 'Stop') {
					self.PLAYMODE = '03'
				} else if (playMode.valueOf() === 'HoldSection') {
					self.PLAYMODE = '04'
				} else if (playMode.valueOf() === 'HoldEnd') {
					self.PLAYMODE = '05'
				}
			}
		} else {
			self.log('debug', `OSC message not handled by processMessage :\n\t ${message.address} ${message.args[0].value}`)
		}
	},
}

module.exports = oscReceiver

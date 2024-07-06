const osc = require('osc')
const { InstanceStatus, CompanionVariableDefinition, CompanionVariableValues } = require('@companion-module/base')
// import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'

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
			self.log('info', `Listening for disguise showcontrol messages on port ${self.config.recieve_port}`)
			self.updateStatus(InstanceStatus.Ok, 'Connected.')
		})

		this.udpPort.on('message', (oscMsg) => {
			this.processMessage(oscMsg, self)
		})

		this.udpPort.on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				self.log('error', 'Error: Selected port in use.' + err.message)
				self.updateStatus(InstanceStatus.ConnectionFailure, `Port ${self.config.localrecieve_portport} in use elsewhere.`)
			} else {
				self.log('error', 'UDP port error: ' + err.message)
				self.updateStatus(InstanceStatus.UnknownError, err.message)
			}
		})
	},

    processMessage: function (message, self) {
		if (message.address === '/d3/showcontrol/heartbeat') {
			if (message.args.length > 0) {
				let heartbeat = message.args[0].value
				self.setVariableValues({
					heartbeat: heartbeat,
				})

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
		}
	}
	// convertToMmSs(msValue) {
	// 	let seconds = Math.floor(msValue / 1000)
	// 	let mm = Math.floor(seconds / 60)
	// 		.toString()
	// 		.padStart(2, '0')
	// 	let ss = Math.floor(seconds % 60)
	// 		.toString()
	// 		.padStart(2, '0')
	// 	return `${mm}:${ss}`
	// },
	// setSectionVariables(self) {
	// 	self.log('debug', `Setting section variables for section ${self.sectionIndex}`)
	// 	//self.log('debug', JSON.stringify(self.presentation))

	// 	//self.sectionIndex is 1-based
	// 	if (self.sectionIndex < 1) {
	// 		self.log('debug', `Section index is 0, setting defaults`)
	// 		return this.setDefaultSectionVariables(self)
	// 	}

	// 	if (!self.presentation || self.presentation == '{}') {
	// 		self.log('debug', `No presentation data, setting defaults`)
	// 		return this.setDefaultSectionVariables(self)
	// 	}

	// 	if (self.presentation.sections.length < self.sectionIndex) {
	// 		self.log('debug', `Section index out of range, setting defaults`)
	// 		return this.setDefaultSectionVariables(self)
	// 	}

	// 	let section = self.presentation.sections[self.sectionIndex - 1]
	// 	self.log(
	// 		'debug',
	// 		`Section ${self.sectionIndex} (${section.name}):  ${section.slideCount} slides, starting at slide ${section.firstSlide}`
	// 	)
	// 	self.setVariableValues({
	// 		sectionName: section.name,
	// 		sectionSlideCount: section.slideCount,
	// 		sectionFirstSlide: section.firstSlide,
	// 	})
	// },
	// setDefaultSectionVariables(self) {
	// 	return self.setVariableValues({
	// 		sectionName: '(none)',
	// 		sectionSlideCount: 0,
	// 		sectionFirstSlide: 0,
	// 	})
	// },
}

module.exports = oscReceiver
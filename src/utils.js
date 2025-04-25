const {
	InstanceStatus,
	CompanionVariableDefinition,
	CompanionVariableValues,
	combineRgb,
} = require('@companion-module/base')

const utils = {
	// boolean to assist with changing numeric values in both directions on a single button
	shift: false,

	// disguise master brightness and volume limits
	max_value: 1.0,
	min_value: 0.0,

	// increase the value of a 2 decimal point float <value> by <step>
	increment_float: function (value, step) {
		return Math.min(parseFloat(value) + parseFloat(step), this.max_value).toFixed(2)
	},

	// decrease the value of a 2 decimal point float <value> by <step>
	decrement_float: function (value, step) {
		return Math.max(parseFloat(value) - parseFloat(step), this.min_value).toFixed(2)
	},

	// Function to split the string based on the given criteria
	customSplit: function (str) {
		// Define the regex pattern to split based on the criteria
		const regex = /(?<=\.\d{2}) /

		// Split the input string using the regex
		let parts = str.split(regex)

		// Trim leading and trailing whitespaces from each segment
		parts = parts.map((part) => part.trim())

		return parts
	},
	processMessage: function (message, self) {
		if (message.address === '/d3/showcontrol/heartbeat') {
			if (message.args.length > 0) {
				let heartbeat = message.args[0].value
				self.setVariableValues({
					heartbeat: heartbeat.toFixed(2),
				})
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
				// console.log(currentSectionName.length)
				if (currentSectionName.length > 0) {
					self.setVariableValues({
						currentSectionName: currentSectionName,
					})
				} else {
					self.setVariableValues({
						currentSectionName: 'Start',
					})
				}
			}
		} else if (message.address === '/d3/showcontrol/nextsectionname') {
			if (message.args.length > 0) {
				var nextSectionName = message.args[0].value

				if (nextSectionName.length > 0) {
					self.setVariableValues({
						nextSectionName: nextSectionName,
					})
				} else {
					self.setVariableValues({
						nextSectionName: 'End',
					})
				}
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
					volume: volume.toFixed(2), // volume in %
				})
			}
		} else if (message.address === '/d3/showcontrol/brightness') {
			if (message.args.length > 0) {
				var brightness = message.args[0].value
				self.setVariableValues({
					brightness: brightness.toFixed(2), // brightness
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
	// colors shorthand
	MatteBlack: combineRgb(40, 40, 43),
	Gainsboro: combineRgb(220, 220, 220),
	FireBrick: combineRgb(178, 34, 34),
}

module.exports = utils

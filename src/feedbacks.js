const { combineRgb } = require('@companion-module/base')
const osc_server = require('./osc_server.js')
const fs = require('fs')
const path = require('path')
const utils = require('./utils')

// Path to button image directory
const imageDir = path.join(__dirname, '/images')

exports.initFeedbacks = function () {
	let self = this
	let feedbacks = {}

	feedbacks['decrease_brightness'] = {
		name: 'Reduce brightness',
		type: 'boolean',
		defaultStyle: {
			description: 'Indicates "shift aware brightness" action mode',
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/brightness_down.png`, 'base64'),
		},
		options: [],
		callback: (feedback) => {
			if (utils.shift === true) {
				return true
			}
		},
	}
	feedbacks['increase_brightness'] = {
		name: 'Increase brightness',
		type: 'boolean',
		description: 'Indicates "shift aware brightness" action mode',
		defaultStyle: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/brightness_up.png`, 'base64'),
		},
		options: [],
		callback: (feedback) => {
			if (utils.shift === false) {
				return true
			}
		},
	}
	feedbacks['decrease_volume'] = {
		name: 'Reduce volume',
		type: 'boolean',
		defaultStyle: {
			description: 'Indicates "shift aware volume" action mode',
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/volume_down.png`, 'base64'),
		},
		options: [],
		callback: (feedback) => {
			if (utils.shift === true) {
				return true
			}
		},
	}
	feedbacks['increase_volume'] = {
		name: 'Increase volume',
		type: 'boolean',
		description: 'Indicates "shift aware volume" action mode',
		defaultStyle: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/volume_up.png`, 'base64'),
		},
		options: [],
		callback: (feedback) => {
			if (utils.shift === false) {
				return true
			}
		},
	}
	feedbacks['PlayMode'] = {
		name: 'playmode',
		type: 'boolean',
		description: 'Blinks background if selected playmode is active',
		defaultStyle: {
			bgcolor: utils.MatteBlack,
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
	}
	feedbacks['Heartbeat'] = {
		name: 'heartbeat',
		type: 'boolean',
		description: 'Blinks background if disguise heartbeat is detected',
		defaultStyle: {
			bgcolor: utils.Gainsboro,
		},
		options: [],
		callback: (feedback) => {
			if (osc_server.lastHeartbeat != this.getVariableValue('heartbeat') && this.blink_button) {
				return true
			} else if (osc_server.lastHeartbeat === this.getVariableValue('heartbeat')) {
				this.PLAYMODE = null
				return false
			}
			osc_server.lastHeartbeat = this.getVariableValue('heartbeat')
		},
	}
	feedbacks['Brightness'] = {
		name: 'Master brightness',
		type: 'boolean',
		description: 'Blinks background if disguise master brightness is zero',
		defaultStyle: {
			bgcolor: utils.FireBrick,
			color: utils.FireBrick,
		},
		options: [],
		callback: (feedback) => {
			if (this.getVariableValue('brightness') === '0.00' && this.blink_button) {
				return true
			}
		},
	}
	feedbacks['Volume'] = {
		name: 'Master volume',
		type: 'boolean',
		description: 'Blinks background if disguise master volume is zero',
		defaultStyle: {
			bgcolor: utils.FireBrick,
			color: utils.FireBrick,
		},
		options: [],
		callback: (feedback) => {
			if (this.getVariableValue('volume') === '0.00' && this.blink_button) {
				return true
			}
		},
	}
	this.setFeedbackDefinitions(feedbacks)
}

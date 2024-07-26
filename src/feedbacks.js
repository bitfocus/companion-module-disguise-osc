const { combineRgb } = require('@companion-module/base')
const osc_server = require('./osc_server.js')
const utils = require('./utils')

exports.initFeedbacks = function () {
	let self = this
	let feedbacks = {}

	feedbacks['PlayMode'] = {
		name: 'playmode',
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
			bgcolor: combineRgb(204, 0, 0),
			color: combineRgb(0, 0, 0),
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
			bgcolor: combineRgb(204, 0, 0),
			color: combineRgb(110, 110, 110),
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
			bgcolor: combineRgb(204, 0, 0),
			color: combineRgb(110, 110, 110),
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

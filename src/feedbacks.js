const osc_server = require('./osc_server')
const choices = require('./choices')
const utils = require('./utils')
const icons = require('./icons')
const { combineRgb } = require('@companion-module/base')

exports.initFeedbacks = function () {
	let feedbacks = {}

	feedbacks['decrease_brightness'] = {
		name: 'Reduce brightness',
		type: 'boolean',
		description: 'Indicates "shift aware brightness" action mode',
		defaultStyle: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.brightness_down,
		},
		options: [],
		callback: () => {
			if (utils.shift === true) {
				return true
			} else {
				return false
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
			png64: icons.brightness_up,
		},
		options: [],
		callback: () => {
			if (utils.shift === false) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['decrease_volume'] = {
		name: 'Reduce volume',
		type: 'boolean',
		description: 'Indicates "shift aware volume" action mode',
		defaultStyle: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.volume_down,
		},
		options: [],
		callback: () => {
			if (utils.shift === true) {
				return true
			} else {
				return false
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
			png64: icons.volume_up,
		},
		options: [],
		callback: () => {
			if (utils.shift === false) {
				return true
			} else {
				return false
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
		description: 'Blinks background if Disguise heartbeat is detected',
		defaultStyle: {
			bgcolor: utils.Gainsboro,
		},
		options: [],
		callback: () => {
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
		description: 'Blinks background if Disguise master brightness is zero',
		defaultStyle: {
			bgcolor: utils.FireBrick,
			color: utils.FireBrick,
		},
		options: [],
		callback: () => {
			if (this.getVariableValue('brightness') === '0.00' && this.blink_button) {
				return true
			} else {
				return false
			}
		},
	}
	feedbacks['Volume'] = {
		name: 'Master volume',
		type: 'boolean',
		description: 'Blinks background if Disguise master volume is zero',
		defaultStyle: {
			bgcolor: utils.FireBrick,
			color: utils.FireBrick,
		},
		options: [],
		callback: () => {
			if (this.getVariableValue('volume') === '0.00' && this.blink_button) {
				return true
			} else {
				return false
			}
		},
	}
	// Generic user-configurable OSC feedback
	feedbacks['custom_osc_feedback'] = {
		name: 'Custom OSC Feedback',
		type: 'boolean',
		description: 'User-configurable feedback for OSC address and value',
		defaultStyle: {
			bgcolor: combineRgb(0, 128, 0),
			color: utils.MatteBlack,
		},
		options: [
			{
				type: 'textinput',
				id: 'd3_osc_path',
				label: 'Disguise OSC Path',
				default: '/d3/fadestatus',
				useVariables: true,
				tooltip: 'Disguise OSC path to match (can use variables)',
			},
			{
				type: 'textinput',
				id: 'expected_value',
				label: 'Expected Value',
				default: 'Fade up',
				useVariables: true,
				tooltip: 'Expected value to match (can use variables)',
			},
			{
				type: 'dropdown',
				id: 'comparison',
				label: 'Comparison Type',
				default: 'equals',
				choices: [
					{ id: 'equals', label: 'Equals' },
					{ id: 'contains', label: 'Contains' },
					{ id: 'regex', label: 'Regex' },
				],
				tooltip: 'How to compare the received value',
			},
			{
				type: 'dropdown',
				id: 'value_type',
				label: 'Value Type',
				default: 'string',
				choices: [
					{ id: 'string', label: 'String' },
					{ id: 'int', label: 'Integer' },
					{ id: 'float', label: 'Float' },
				],
				tooltip: 'Type of value for validation',
			},
		],
		callback: async (context) => {
			// Use only the parseVariables or parseVariablesInString provided to the callback
			let d3OscPath, expectedValue
			try {
				d3OscPath = context.options.d3_osc_path
				expectedValue = context.options.expected_value
			} catch (err) {
				this.log('debug', '[User OSC Feedback DEBUG] parseVariables error:', err)
				return false
			}
			const comparison = context.options.comparison
			const valueType = context.options.value_type

			// Get last received value for path
			const receivedArgs = osc_server.getLastValueForAddress ? osc_server.getLastValueForAddress(d3OscPath) : undefined
			let receivedValue = undefined
			if (Array.isArray(receivedArgs) && receivedArgs.length > 0) {
				receivedValue = receivedArgs[0].value !== undefined ? receivedArgs[0].value : receivedArgs[0]
			}

			// Validation
			let valid = true
			if (valueType === 'int' && expectedValue !== '' && !/^[-+]?\d+$/.test(expectedValue)) {
				valid = false
				this.log('debug', 'Expected value is not a valid integer')
			}
			if (valueType === 'float' && expectedValue !== '' && !/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(expectedValue)) {
				valid = false
				this.log('debug', 'Expected value is not a valid float')
			}
			if (!valid) return false

			// Comparison
			if (receivedValue === undefined) return false
			if (comparison === 'equals') {
				return receivedValue == expectedValue
			} else if (comparison === 'contains') {
				return (receivedValue + '').includes(expectedValue)
			} else if (comparison === 'regex') {
				try {
					return new RegExp(expectedValue).test(receivedValue + '')
				} catch (e) {
					this.log('debug', 'Regex error: ' + e)
					return false
				}
			}
			return false
		},
	}

	this.setFeedbackDefinitions(feedbacks)
}

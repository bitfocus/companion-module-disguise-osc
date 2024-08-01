const fs = require('fs')
const path = require('path')
const utils = require('./utils')

// Path to button image directory
const imageDir = path.join(__dirname, 'images')

exports.initPresets = function () {
	let presets = {}

	presets['heartbeat'] = {
		name: 'Heartbeat',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/heartbeat.png`, 'base64'),
			bgcolor: utils.MatteBlack,
		},
		steps: [
			{
				down: [{ actionId: 'shift' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Heartbeat',
				style: {
					bgcolor: utils.Gainsboro,
				},
			},
		],
	}
	presets['play'] = {
		name: 'Play',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/play.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'play' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '00',
				},
				style: {
					bgcolor: utils.MatteBlack,
				},
			},
		],
	}
	presets['playsection'] = {
		name: 'Play to end of section',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/playToEndOfSection.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'playsection' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '01',
				},
				style: {
					bgcolor: utils.MatteBlack,
				},
			},
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '04',
				},
				style: {
					bgcolor: utils.MatteBlack,
				},
			},
		],
	}
	presets['loopSection'] = {
		name: 'Loop section',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/loop.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'loopsection' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '02',
				},
				style: {
					bgcolor: utils.MatteBlack,
				},
			},
		],
	}
	presets['stop'] = {
		name: 'Stop',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/stop.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'stop' }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '03',
				},
				style: {
					bgcolor: utils.MatteBlack,
				},
			},
		],
	}
	presets['previoussection'] = {
		name: 'Previous section',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/prevSection.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'previoussection' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['nextsection'] = {
		name: 'Next section',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/nextSection.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'nextsection' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['returntostart'] = {
		name: 'Return to start',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/backToStart.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'returntostart' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['previoustrack'] = {
		name: 'Previous track',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/prevTrack.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'previoustrack' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['nexttrack'] = {
		name: 'Next track',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/nextTrack.png`, 'base64'),
			bgcolor: utils.Gainsboro,
		},
		steps: [
			{
				down: [{ actionId: 'nexttrack' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['fadedown'] = {
		name: 'Fade down',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: 'fade\ndown',
			png64: fs.readFileSync(`${imageDir}/empty.png`, 'base64'),
			size: '18',
			bgcolor: utils.MatteBlack,
		},
		steps: [
			{
				down: [{ actionId: 'fadedown' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['fadeup'] = {
		name: 'Fade up',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: 'fade\nup',
			png64: fs.readFileSync(`${imageDir}/empty.png`, 'base64'),
			size: '18',
			bgcolor: utils.MatteBlack,
		},
		steps: [
			{
				down: [{ actionId: 'fadeup' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['hold'] = {
		name: 'Hold',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: 'hold',
			png64: fs.readFileSync(`${imageDir}/empty.png`, 'base64'),
			size: '18',
			bgcolor: utils.MatteBlack,
		},
		steps: [
			{
				down: [{ actionId: 'hold' }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['decrement_brightness'] = {
		name: 'Reduce master brightness',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/brightness_down.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'decrement_brightness',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Brightness',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['increment_brightness'] = {
		name: 'Increase master brightness',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/brightness_up.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'increment_brightness',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Brightness',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['brightness'] = {
		name: 'Shift aware brightness',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/brightness.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'shift_brightness',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'increase_brightness',
				style: {
					color: utils.Gainsboro,
					text: '$(d3-osc:brightness)',
					alignment: 'center:top',
					size: '14',
					bgcolor: utils.Gainsboro,
					png64: fs.readFileSync(`${imageDir}/brightness_up.png`, 'base64'),
				},
			},
			{
				feedbackId: 'decrease_brightness',
				style: {
					color: utils.Gainsboro,
					text: '$(d3-osc:brightness)',
					alignment: 'center:top',
					size: '14',
					bgcolor: utils.Gainsboro,
					png64: fs.readFileSync(`${imageDir}/brightness_down.png`, 'base64'),
				},
			},
			{
				feedbackId: 'Brightness',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['decrement_volume'] = {
		name: 'Reduce master volume',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/volume_down.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'decrement_volume',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Volume',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['increment_volume'] = {
		name: 'Increase master volume',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/volume_up.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'increment_volume',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Volume',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['volume'] = {
		name: 'Shift aware volume',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: fs.readFileSync(`${imageDir}/volume.png`, 'base64'),
		},
		steps: [
			{
				down: [
					{
						actionId: 'shift_volume',
						options: {
							float: '0.01',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'increase_volume',
				style: {
					color: utils.Gainsboro,
					text: '$(d3-osc:volume)',
					alignment: 'center:top',
					size: '14',
					bgcolor: utils.Gainsboro,
					png64: fs.readFileSync(`${imageDir}/volume_up.png`, 'base64'),
				},
			},
			{
				feedbackId: 'decrease_volume',
				style: {
					color: utils.Gainsboro,
					text: '$(d3-osc:volume)',
					alignment: 'center:top',
					size: '14',
					bgcolor: utils.Gainsboro,
					png64: fs.readFileSync(`${imageDir}/volume_down.png`, 'base64'),
				},
			},
			{
				feedbackId: 'Volume',
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	this.setPresetDefinitions(presets)
}

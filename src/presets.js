const utils = require('./utils')
const icons = require('./icons')

exports.initPresets = function () {
	let presets = {}

	presets['heartbeat'] = {
		name: 'Heartbeat',
		category: 'Show control',
		type: 'button',
		style: {
			color: utils.Gainsboro,
			png64: icons.heartbeat,
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
			png64: icons.play,
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
			png64: icons.playToEndofSection,
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
			png64: icons.loop,
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
			png64: icons.stop,
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
			png64: icons.prevSection,
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
			png64: icons.nextSection,
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
			png64: icons.backToStart,
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
			png64: icons.prevTrack,
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
			png64: icons.nextTrack,
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
			png64: icons.empty,
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
			png64: icons.empty,
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
			png64: icons.empty,
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
			png64: icons.brightness_down,
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
			png64: icons.brightness_up,
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
			png64: icons.brightness,
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
					png64: icons.brightness_up,
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
					png64: icons.brightness_down,
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
			png64: icons.volume_down,
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
			png64: icons.volume_up,
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
			png64: icons.volume,
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
					png64: icons.volume_up,
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
					png64: icons.volume_down,
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

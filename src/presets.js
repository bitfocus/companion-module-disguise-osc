import utils from './utils.js'
import icons from './icons.js'

export function initPresets() {
	let presets = {}

	presets['heartbeat'] = {
		name: 'Heartbeat',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.heartbeat,
			bgcolor: utils.MatteBlack,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'shift', options: {} }],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'Heartbeat',
				options: {},
				style: {
					bgcolor: utils.Gainsboro,
				},
			},
		],
	}
	presets['play'] = {
		name: 'Play',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.play,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'play', options: {} }],
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
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.playToEndofSection,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'playsection', options: {} }],
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
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.loop,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'loopsection', options: {} }],
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
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.stop,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'stop', options: {} }],
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
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.prevSection,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'previoussection', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['nextsection'] = {
		name: 'Next section',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.nextSection,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'nextsection', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['returntostart'] = {
		name: 'Return to start',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.backToStart,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'returntostart', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['previoustrack'] = {
		name: 'Previous track',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.prevTrack,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'previoustrack', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['nexttrack'] = {
		name: 'Next track',
		type: 'simple',
		style: {
			text: '',
			size: 'auto',
			color: utils.Gainsboro,
			png64: icons.nextTrack,
			bgcolor: utils.Gainsboro,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'nexttrack', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['fadedown'] = {
		name: 'Fade down',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: 'fade\ndown',
			png64: icons.empty,
			size: '18',
			bgcolor: utils.MatteBlack,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'fadedown', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['fadeup'] = {
		name: 'Fade up',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: 'fade\nup',
			png64: icons.empty,
			size: '18',
			bgcolor: utils.MatteBlack,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'fadeup', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['hold'] = {
		name: 'Hold',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: 'hold',
			png64: icons.empty,
			size: '18',
			bgcolor: utils.MatteBlack,
			show_topbar: false,
		},
		steps: [
			{
				down: [{ actionId: 'hold', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}
	presets['decrement_brightness'] = {
		name: 'Reduce master brightness',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.brightness_down,
			show_topbar: false,
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['increment_brightness'] = {
		name: 'Increase master brightness',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.brightness_up,
			show_topbar: false,
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['brightness'] = {
		name: 'Shift aware brightness',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.brightness,
			show_topbar: false,
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
				options: {},
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
				options: {},
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['decrement_volume'] = {
		name: 'Reduce master volume',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.volume_down,
			show_topbar: false,
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['increment_volume'] = {
		name: 'Increase master volume',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.volume_up,
			show_topbar: false,
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	presets['volume'] = {
		name: 'Shift aware volume',
		type: 'simple',
		style: {
			color: utils.Gainsboro,
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: utils.Gainsboro,
			png64: icons.volume,
			show_topbar: false,
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
				options: {},
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
				options: {},
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
				options: {},
				style: {
					color: utils.FireBrick,
					bgcolor: utils.FireBrick,
				},
			},
		],
	}
	const structure = [{ id: 'show_control', name: 'Show control', definitions: Object.keys(presets) }]

	this.setPresetDefinitions(structure, presets)
}

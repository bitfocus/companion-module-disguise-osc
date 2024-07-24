const {
	InstanceStatus,
	CompanionVariableDefinition,
	CompanionVariableValues,
	combineRgb,
} = require('@companion-module/base')

const fs = require('fs')
const path = require('path')

// Path to the directory
const imageDir = path.join(__dirname, 'images')

const PRESETS = {
	play: {
		name: 'Play',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/play.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(0, 0, 0),
				},
			},
		],
	},
	playsection: {
		name: 'Play to end of section',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/playToEndOfSection.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(0, 0, 0),
				},
			},
			{
				feedbackId: 'PlayMode',
				options: {
					mode: '04',
				},
				style: {
					bgcolor: combineRgb(0, 0, 0),
				},
			},
		],
	},
	loopSection: {
		name: 'Loop section',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/loop.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(0, 0, 0),
				},
			},
		],
	},
	stop: {
		name: 'Stop',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/stop.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(0, 0, 0),
				},
			},
		],
	},
	previoussection: {
		name: 'Previous section',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/prevSection.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
		},
		steps: [
			{
				down: [{ actionId: 'previoussection' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	nextsection: {
		name: 'Next section',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/nextSection.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
		},
		steps: [
			{
				down: [{ actionId: 'nextsection' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	returntostart: {
		name: 'Return to start',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/backToStart.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
		},
		steps: [
			{
				down: [{ actionId: 'returntostart' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	previoustrack: {
		name: 'Previous track',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/prevTrack.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
		},
		steps: [
			{
				down: [{ actionId: 'previoustrack' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	nexttrack: {
		name: 'Next track',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			png64: fs.readFileSync(`${imageDir}/nextTrack.png`, 'base64'),
			bgcolor: combineRgb(255, 255, 255),
		},
		steps: [
			{
				down: [{ actionId: 'nexttrack' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	fadedown: {
		name: 'Fade down',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			text: 'fade\ndown',
			size: '18',
			bgcolor: combineRgb(16, 16, 16),
		},
		steps: [
			{
				down: [{ actionId: 'fadedown' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	fadeup: {
		name: 'Fade up',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			text: 'fade\nup',
			size: '18',
			bgcolor: combineRgb(16, 16, 16),
		},
		steps: [
			{
				down: [{ actionId: 'fadeup' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	hold: {
		name: 'Hold',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(255, 255, 255),
			text: 'hold',
			size: '18',
			bgcolor: combineRgb(16, 16, 16),
		},
		steps: [
			{
				down: [{ actionId: 'hold' }],
				up: [],
			},
		],
		feedbacks: [],
	},
	decrement_brightness: {
		name: 'Reduce master brightness',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(110, 110, 110),
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(110, 0, 0),
				},
			},
		],
	},
	increment_brightness: {
		name: 'Raise master brightness',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(110, 110, 110),
			text: '$(d3-osc:brightness)',
			alignment: 'center:top',
			size: '14',
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(110, 0, 0),
				},
			},
		],
	},
	decrement_volume: {
		name: 'Reduce master volume',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(110, 110, 110),
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(110, 0, 0),
				},
			},
		],
	},
	increment_volume: {
		name: 'Raise master volume',
		category: 'Show control',
		type: 'button',
		style: {
			color: combineRgb(110, 110, 110),
			text: '$(d3-osc:volume)',
			alignment: 'center:top',
			size: '14',
			bgcolor: combineRgb(255, 255, 255),
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
					bgcolor: combineRgb(110, 0, 0),
				},
			},
		],
	},
}

module.exports = {
	PRESETS,
}

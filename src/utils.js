const { InstanceStatus, CompanionVariableDefinition, CompanionVariableValues } = require('@companion-module/base')

const utils = {
	max_value: 1.00,
    min_value: 0.00,

	increment_float: function (value, step) {
		return Math.min(parseFloat(value) + parseFloat(step), this.max_value).toFixed(2)
	},

    decrement_float: function (value, step) {
		return Math.max(parseFloat(value) - parseFloat(step), this.min_value).toFixed(2)
	},
}

module.exports = utils

const { InstanceStatus, CompanionVariableDefinition, CompanionVariableValues, combineRgb } = require('@companion-module/base')

const utils = {
	// disguise master brightness and volume limits
	max_value: 1.00,
    min_value: 0.00,

	// increase the value of a 2 decimal point float <value> by <step> 
	increment_float: function (value, step) {
		return Math.min(parseFloat(value) + parseFloat(step), this.max_value).toFixed(2)
	},

	// decrease the value of a 2 decimal point float <value> by <step> 
    decrement_float: function (value, step) {
		return Math.max(parseFloat(value) - parseFloat(step), this.min_value).toFixed(2)
	},

	// colors shorthand
	MatteBlack: combineRgb(40,40,43),
	Gainsboro: combineRgb(220,220,220),
	FireBrick: combineRgb(178, 34, 34),
}

module.exports = utils

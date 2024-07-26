exports.initVariables = function () {
	const variables = [
		{ variableId: 'heartbeat', name: 'heartbeat' },
		{ variableId: 'trackposition', name: 'trackposition' },
		{ variableId: 'trackposition_hh', name: 'trackposition_hh' },
		{ variableId: 'trackposition_mm', name: 'trackposition_mm' },
		{ variableId: 'trackposition_ss', name: 'trackposition_ss' },
		{ variableId: 'trackposition_ff', name: 'trackposition_ff' },
		{ variableId: 'timecodeposition', name: 'timecodeposition' },
		{ variableId: 'timecodeposition_hh', name: 'timecodeposition_hh' },
		{ variableId: 'timecodeposition_mm', name: 'timecodeposition_mm' },
		{ variableId: 'timecodeposition_ss', name: 'timecodeposition_ss' },
		{ variableId: 'timecodeposition_ff', name: 'timecodeposition_ff' },
		{ variableId: 'trackname', name: 'trackname' },
		{ variableId: 'trackid', name: 'trackid' },
		{ variableId: 'currentSectionName', name: 'currentSectionName' },
		{ variableId: 'nextSectionName', name: 'nextSectionName' },
		{ variableId: 'sectionHint', name: 'sectionHint' },
		{ variableId: 'sectionElapsed', name: 'current section time elapsed' },
		{ variableId: 'sectionRemaining', name: 'current section time remaining' },
		{ variableId: 'volume', name: 'volume' },
		{ variableId: 'brightness', name: 'brightness' },
		{ variableId: 'bpm', name: 'bpm' },
		{ variableId: 'playMode', name: 'playMode' },
	]

	this.setVariableDefinitions(variables)
}

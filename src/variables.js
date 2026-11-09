export function initVariables() {
	const variables = {
		heartbeat: { name: 'heartbeat' },
		trackposition: { name: 'trackposition' },
		trackposition_hh: { name: 'trackposition_hh' },
		trackposition_mm: { name: 'trackposition_mm' },
		trackposition_ss: { name: 'trackposition_ss' },
		trackposition_ff: { name: 'trackposition_ff' },
		timecodeposition: { name: 'timecodeposition' },
		timecodeposition_hh: { name: 'timecodeposition_hh' },
		timecodeposition_mm: { name: 'timecodeposition_mm' },
		timecodeposition_ss: { name: 'timecodeposition_ss' },
		timecodeposition_ff: { name: 'timecodeposition_ff' },
		trackname: { name: 'trackname' },
		trackid: { name: 'trackid' },
		currentSectionName: { name: 'currentSectionName' },
		nextSectionName: { name: 'nextSectionName' },
		sectionHint: { name: 'sectionHint' },
		sectionElapsed: { name: 'current section time elapsed' },
		sectionRemaining: { name: 'current section time remaining' },
		volume: { name: 'volume' },
		brightness: { name: 'brightness' },
		bpm: { name: 'bpm' },
		playMode: { name: 'playMode' },
	}

	this.setVariableDefinitions(variables)
}

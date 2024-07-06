// 0 = Over
// 1 = Alpha
// 2 = Add
// 3 = Multiply
// 4 = Mask
// 5 = Multiply-fade
// 6 = Multiply-alpha
// 7 = Premult-Alpha
// 8 = Screen
// 9 = Overlay
// 10 = Hard Light
// 11 = Soft Light
// 12 = Colour Burn
// 13 = Darken
// 14 = Lighten
// 15 = Difference
// 16 = Exclusion
// 17 = Colour Dodge
// 18 = Hard Mix
// 19 = Over-alpha

const CHOICES_BLENDMODE = [
	{ id: '00', label: 'Over' },
	{ id: '01', label: 'Alpha' },
	{ id: '02', label: 'Add' },
	{ id: '03', label: 'Multiply' },
	{ id: '04', label: 'Mask' },
	{ id: '05', label: 'Multiply-fade' },
	{ id: '06', label: 'Multiply-alpha' },
	{ id: '07', label: 'Premult-Alpha' },
	{ id: '08', label: 'Screen' },
	{ id: '09', label: 'Overlay' },
	{ id: '10', label: 'Hard Light' },
	{ id: '11', label: 'Soft Light' },
	{ id: '12', label: 'Colour Burn' },
	{ id: '13', label: 'Darken' },
	{ id: '14', label: 'Lighten' },
	{ id: '15', label: 'Difference' },
	{ id: '16', label: 'Exclusion' },
	{ id: '17', label: 'Colour Dodge' },
	{ id: '18', label: 'Hard Mix' },
	{ id: '19', label: 'Over-alpha' },
]

const CHOICES_PLAYMODE = [
    { id: '00', label: 'Play' },
    { id: '01', label: 'PlaySection' },
    { id: '02', label: 'LoopSection' },
    { id: '03', label: 'Stop' },
    { id: '04', label: 'HoldSection' },
    { id: '05', label: 'HoldEnd' },
]

module.exports = {
	CHOICES_BLENDMODE,
    CHOICES_PLAYMODE,
}

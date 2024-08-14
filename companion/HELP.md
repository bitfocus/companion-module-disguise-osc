## disguise OSC

This module provides default OSC controls to the d3/disguise server. Setup OSC transport within d3/disguise.
Full functionality is only available if the disguise is configured to _always send_ osc feedback

**ACTIONS**

**show control**

- Play
- Play to end of section
- Loop section
- Stop
- Previous Section
- Next Section
- Return to start
- Previous track
- Next track
- Track name
- Track ID
- Cue
- Float Cue
- Fade up
- Fade down
- Hold
- Decrease master volume
- Increase master volume
- Toggle shift<sup>1</sup>
- Shift aware volume<sup>2</sup>
- Decrease master brightness
- Decrease master brightness
- Shift aware brightness<sup>2</sup>

**layer control**

- video layer
  - blendmode
  - brightness
  - tint
  - speed
  - mode
  - at end point
  - transition_time
  - volume
  - brightness (shift)
  - contrast (scale)
  - saturation scale

**VARIABLES**

- master brightness
- currentSectionName
- nextSectionName
- heartbeat
- playMode
- current section time elapsed
- current section time remaining
- sectionHint
- timecode position
- timecode position hours
- timecode position minutes
- timecode position seconds
- timecode position frames
- trackid
- track name
- track position
- track position hours
- track position minutes
- track position seconds
- track position frames
- master volume
- bpm

**PRESETS**

- play
- play section
- loop section
- stop
- previous section
- next section
- return to start
- previous track
- next track
- fade up
- fade down
- hold
- shift aware volume<sup>4</sup>
- decrease master volume
- increase master volume
- shift aware brightness<sup>4</sup>
- decrease master brightness
- decrease master brightness
- heartbeat / toggle shift<sup>3</sup>

**FEEDBACKS**

- heartbeat
- playmode
- increase volume<sup>5</sup>
- decrease volume<sup>5</sup>
- master volume = 0
- increase brightness<sup>5</sup>
- decrease brightness<sup>5</sup>
- master brightness = 0

**NOTES**

1. Toggle shift inverts a boolean variable not available to the user. It provides increased functionality to shift aware actions, presets and feedbacks.
2. If shift is _false_ shift aware volume / brightness decrement the linked value by the user provided step value. If shift is _true_ shift aware volume/brightness increment the linked value by the user provided step value.
3. The heartbeat preset includes the toggle shift action. Each time the button is pressed shift will invert.
4. Shift aware volume/brightness presets allow chnages to be made in both directions depending on the value of the shift variable
5. increase (or decrease) volume (or brightness) feedbacks change the png on the button to indicate if the shift variable state is set to allow increase or decrease to volume and brightness

## disguise OSC
This module provides default OSC controls to the d3/disguise server. Setup OSC transport within d3/disguise.

**ACTIONS**

**show control**

* Play
* Play to end of section
* Loop section
* Stop
* Previous Section
* Next Section
* Return to start
* Previous track
* Next track
* Track name
* Track ID
* Cue
* Float Cue
* Fade up
* Fade down
* Hold
* Decrease master volume
* Increase master volume
* Decrease master brightness
* Decrease master brightness

**layer control**

* video layer
    * blendmode
    * brightness
    * tint 
    * speed
    * mode
    * at end point
    * transition_time
    * volume
    * brightness (shift)
    * contrast (scale)
    * saturation scale

**VARIABLES**

* master brightness
* currentSectionName	
* nextSectionName
* heartbeat	
* playMode
* current section time elapsed
* current section time remaining
* sectionHint
* timecode position
* timecode position hours
* timecode position minutes
* timecode position seconds
* timecode position frames
* trackid	
* track name
* track position
* track position hours
* track position minutes
* track position seconds
* track position frames
* master volume
* bpm

**PRESETS**

* play
* play section
* loop section
* stop
* previous section
* next section
* return to start
* previous track
* next track
* fade up
* fade down
* hold
* decrease master volume
* increase master volume
* decrease master brightness
* decrease master brightness

**FEEDBACKS**

* heartbeat
* playmode
* master volume = 0
* master brightness = 0

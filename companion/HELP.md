## disguise OSC
This module provides default OSC controls to the d3/disguise server. Setup OSC transport within d3/disguise.

**Available commands for disguise**

**Input Messages**
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
* Volume
* Brightness

**Output Messages**
* Heartbeat
* Track position
* Track name
* Track ID
* Timecode position (if supported in d3 version)
* Current section name
* Next section name
* Section hint
* Section time remaining
* Volume
* Brightness
* BPM
* Play mode

**Layer Messages**
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
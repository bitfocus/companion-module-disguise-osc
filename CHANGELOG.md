### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### 2.1.0 (2026-01-16)

### Changed

- Branch renamed and semantic version bumped from 2.0.6 to 2.1.0 for alignment with new release cycle.

#### 2.0.6 (2026-01-12)

### Added

- User-configurable feedback: allows users to define feedbacks for any Disguise OSC path, with support for variables, value type validation, and debug logging.
- User-defined custom OSC action: allows sending an OSC message to any path with a single argument (int, float, or string), with variable support and backend validation.

### Changed

- Combined Cue and Float Cue actions to accept both direct values and variables, with validation and improved UI clarity.

### Fixed

- Improved variable support and validation for user input fields in actions and feedbacks.

#### 2.0.5 (2025-10-07)

### Fixed

- Preset icons not sized properly due to topbar

#### 2.0.4 (2025-09-15)

### Fixed

- Dropdown choices not populating correctly
- Ensure compatibility for Companion v4.0.x releases
- Some boolean feedbacks never returning false

#### 2.0.3 (2025-09-14)

### Fixed

- Module crashing while trying to load icons

#### 2.0.0 (2024-8-14)

### Added

- Show control input action : `Float cue`
- Video layer input actions : `blendmode`, `brightness`, `tint`, `speed`, `mode`, `at end point`, `transition_time`, `volume`, `brightness (shift)`, `contrast (scale)`, `saturation scale`
- Variables : `current section time elapsed`, `current section time remaining`, `timecode position`, `timecode position hours`, `timecode position minutes`, `timecode position seconds`, `timecode position frames`
- Presets :
  - `increase master volume`, `decrease master volume`,`increase master brightness`, `decrease master brightness` standalone presets to change master volume and brightness - for more fluid use adding internal actions to repeat the button press with a delay (this button, force if pressed) on press and abort all delayed actions (this button) on release is recommended
  - `heartbeat / toggle shift` blinks if messages are being received from Disguise. A press action toggles a private boolean which alternates `shift aware volume` and `shift aware brightness` actions between increasing and decreasing behaviour
- Feedbacks :
  - `heartbeat` blinks button background if the value of heartbeat variable continues to change
  - `increase volume` changes the button png to indicate if shift aware volume action will increase volume
  - `decrease volume` changes the button png to indicate if shift aware volume action will decrease volume
  - `master volume = 0` blinks button background if master volume is 0
  - `increase brightness` changes the button png to indicate if shift aware brightness action will increase brightness
  - `decrease brightness` changes the button png to indicate if shift aware brightness action will decrease brightness
  - `master brightness = 0` blinks button background if master brightness is 0

### Changed

- Variable `volume` is now `master volume` to differentiate from video layer volume
- Variable `brightness` is now `master brightness` to differentiate from video layer brightness
- Presets now include png graphics mimicking the appearance within the Disguise GUI - designed to be used with topbar hidden
- Playmode feedback now blinks the background of a button

### Fixed

- Refactored for Companion 3.x.x Compatibility : Updated project dependencies and codebase to ensure compatibility with Companion 3.x.x.

### Removed

- Feedback presets have gone (for now) - will (probably) look at implementing them again in future releases

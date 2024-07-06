// VariableMonitor.js
class HeartbeatMonitor {
    constructor(checkInterval = 1000) {
      this.variable = null;
      this.lastChangeTimestamp = Date.now();
      this.checkInterval = checkInterval;
      this.monitorInterval = null;
      this.hasNotChanged = false;
    }
  
    setVariable(newValue) {
      if (this.variable !== newValue) {
        this.variable = newValue;
        this.lastChangeTimestamp = Date.now();
        this.hasNotChanged = false; // Reset the flag when the variable changes
      }
    }
  
    startMonitoring() {
      this.monitorInterval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - this.lastChangeTimestamp > 1000) {
          this.hasNotChanged = true;
        } else {
          this.hasNotChanged = false;
        }
      }, this.checkInterval);
    }
  
    stopMonitoring() {
      clearInterval(this.monitorInterval);
    }
  
    hasNotChangedForMoreThanASecond() {
      return this.hasNotChanged;
    }
  }
  
module.exports = {
	HeartbeatMonitor,
}
//   // Usage example
//   const monitor = new VariableMonitor();

//   // Start monitoring
//   monitor.startMonitoring();

//   // Simulate variable changes
//   setTimeout(() => monitor.setVariable(1), 500); // Variable changes at 500ms
//   setTimeout(() => monitor.setVariable(2), 1500); // Variable changes at 1500ms

//   // Check if the variable has not changed in more than a second
//   setTimeout(() => {
//     console.log(monitor.hasNotChangedForMoreThanASecond()); // Should output true or false depending on the timing
//     monitor.stopMonitoring(); // Stop monitoring when done
//   }, 3000);

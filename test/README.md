# Unit tests

Run `yarn test` with Node.js 26. The tests use the built-in Node.js test runner and the installed project dependencies. Most UDP tests use mocks. The bind-conflict regression test uses local UDP sockets and an OS-assigned port. A Disguise server is not required.

The tests cover transport commands, cue arguments, received variables, feedback, and the OSC receiver.

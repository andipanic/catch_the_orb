var KeyHandler = {
  log: false,
  init: function() {
    window.addEventListener('keydown', event =>
      KeyHandler.keyDown(event), false);
    window.addEventListener('keyup', event =>
      KeyHandler.keyUp(event), false);
  },
  pressed: [],
  keyDown: function(e) {
    if(this.log){
      console.log("Keydown:", e.keyCode, e)
    }
    this.pressed[e.keyCode] = true;
  },
  keyUp: function(e) {
    this.pressed[e.keyCode] = false;
  },
}

KeyHandler.init();

var GamePad = {
  init: function() {
    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
              e.gamepad.index, e.gamepad.id,
              e.gamepad.buttons.length, e.gamepad.axes.length);
        window.gp = navigator.getGamepads();
    });
    window.addEventListener("gamepaddisconnected", function(e) {
        console.log("Gamepad disconnected from index %d: %s",
              e.gamepad.index, e.gamepad.id);
    });
  },
}

GamePad.init();

/*
var joystick = new VirtualJoystick({container: document.getElementById('body'),
                                    mouseSupport: true,
                                    limitStickTravel: true})
*/


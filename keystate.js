var KeyState = (function() {

  var state = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  
  var keyCodeMap = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
  };

  document.addEventListener('keydown', function(event) {
    var direction = keyCodeMap[event.keyCode];
    if(direction === undefined) {
      return;
    }

    state[direction] = true;
  });

  document.addEventListener('keyup', function(event) {
    var direction = keyCodeMap[event.keyCode];
    if(direction === undefined) {
      return;
    }

    state[direction] = false;
  });

  return state;
})();

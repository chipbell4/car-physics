var KeyState = require('./keystate.js');
var CarPhysics = require('./car-physics.js');
var Ui = require('./ui.js');

var viewWidth = 630;
var viewHeight = 410;

// Create a pixi renderer
var renderer = PIXI.autoDetectRenderer(viewWidth, viewHeight);
renderer.view.className = "rendererView";

// add render view to DOM
document.body.appendChild(renderer.view);

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);

// create a new graphics object
var graphics = PIXI.Sprite.fromImage('arrow.png');
graphics.anchor.x = graphics.anchor.y = 0.5;
stage.addChild(graphics);
graphics.width = graphics.height = 52;
graphics.position.x = viewWidth / 2;
graphics.position.y = viewHeight / 2;

var carPhysics = new CarPhysics();

var lastFrame = Date.now();
requestAnimationFrame(animate);

var wrap = function(x, a, b) {
  while(x < a) {
    x += (b - a);
  }

  while(x > b) {
    x -= (b - a);
  }

  return x;
};

function animate() {
  graphics.width = graphics.height = 32;
  var dt = (Date.now() - lastFrame) / 1000;
  lastFrame = Date.now();

  // update car physics based on keyboard
  carPhysics.thrusterOn = KeyState.up;
  carPhysics.turnDirection = 0;
  if(KeyState.left && !KeyState.right) {
    carPhysics.turnDirection = -1;
  } else if(KeyState.right && !KeyState.left) {
    carPhysics.turnDirection = 1;
  }

  // step the physics sim
  carPhysics.update(dt);

  // clamp the physics simulation position
  carPhysics.x = wrap(carPhysics.x, -10, viewWidth + 10);
  carPhysics.y = wrap(carPhysics.y, -10, viewHeight + 10);

  // update the fake car's position and direction
  graphics.position.x = carPhysics.x;
  graphics.position.y = carPhysics.y;
  graphics.rotation = Math.atan2(carPhysics.dy, carPhysics.dx) + Math.PI / 2;

  renderer.render(stage);
  requestAnimationFrame(animate);
}

Ui.build().onChange(function(event) {
  console.log(event);
});

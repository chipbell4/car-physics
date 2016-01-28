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
var graphics = new PIXI.Graphics();
graphics.beginFill(0x00FF00);
graphics.moveTo(0, 0);
graphics.lineTo(-viewWidth * 0.01, viewHeight * 0.03);
graphics.lineTo(viewWidth * 0.01, viewHeight * 0.03);
graphics.endFill();
stage.addChild(graphics);

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
}

function animate() {
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
  carPhysics.x = wrap(carPhysics.x, 0, viewWidth);
  carPhysics.y = wrap(carPhysics.y, 0, viewHeight);

  // update the fake car's position and direction
  graphics.position.x = carPhysics.x;
  graphics.position.y = carPhysics.y;
  graphics.rotation = Math.atan2(carPhysics.dy, carPhysics.dx) + Math.PI / 2;

  renderer.render(stage);
  requestAnimationFrame(animate);
}

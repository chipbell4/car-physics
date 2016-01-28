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

function animate() {
  var dt = (Date.now() - lastFrame) / 1000;
  lastFrame = Date.now();

  carPhysics.update(dt);

  renderer.render(stage);
  requestAnimationFrame(animate);
}

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
graphics.moveTo(viewWidth * 0.5, viewHeight * 0.5);
graphics.lineTo(viewWidth * 0.49, viewHeight * 0.53);
graphics.lineTo(viewWidth * 0.51, viewHeight * 0.53);
graphics.endFill();
stage.addChild(graphics);

requestAnimationFrame(animate);

function animate() {
  renderer.render(stage);
  requestAnimationFrame(animate);
}

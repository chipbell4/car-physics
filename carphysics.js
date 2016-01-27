var CarPhysics = function(options) {
  this.options = options;

  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.dx = 0;
  this.dy = 0;
  this.turnDirection = 0;

  this.thrusterOn = false;
};

CarPhysics.prototype.rotateVector = function(x, y, radians) {
  var cosTheta = Math.cos(radians);
  var sinTheta = Math.sin(radians);

  return [
    cosTheta * x - sinTheta * y,
    sinTheta * y + cosTheta * x
  ];
};

CarPhysics.prototype.update = function(dt) {
  // update position based on velocity
  this.x += this.vx * dt;
  this.y += this.vy * dt;

  // if we're turning, apply a turn direction by rotating the D vector
  if(this.turnDirection !== 0) {
    var rotationAngle = this.turnDirection * 0.1; 
    var rotated = this.rotateVector(this.dx, this.dy, rotationAngle);
    this.dx = rotated[0];
    this.dy = rotated[1];
  }

  // if the thruster is on, apply acceleration
  // TODO: Remove the constant acceleration factor 10
  if(this.thrusterOn) {
    this.vx += this.dx * dt * 10;
    this.vy += this.dy * dt * 10;
  }

  // apply deceleration from friction
  this.vx *= 0.99;
  this.vy *= 0.99;
};

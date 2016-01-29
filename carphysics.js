var CarPhysics = function(options) {
  // provide some defaults
  this.options = options || {};
  this.options.top_speed = this.options.top_speed || 100;
  this.options.acceleration = this.options.acceleration || 50;
  this.options.handling = this.options.handling || 1;
  this.options.traction = this.options.traction || 1;
  this.options.friction = this.options.friction || 0.8;

  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.dx = 0;
  this.dy = -1;
  this.turnDirection = 0;

  this.thrusterOn = false;
};

CarPhysics.prototype.rotateVector = function(x, y, radians) {
  var cosTheta = Math.cos(radians);
  var sinTheta = Math.sin(radians);

  return [
    cosTheta * x - sinTheta * y,
    cosTheta * y + sinTheta * x
  ];
};

CarPhysics.prototype.update = function(dt) {
  // update position based on velocity
  this.x += this.vx * dt;
  this.y += this.vy * dt;

  // if we're turning, apply a turn direction by rotating the D vector
  if(this.turnDirection !== 0) {
    var rotationAngle = this.turnDirection * 0.05;
    var rotated = this.rotateVector(this.dx, this.dy, rotationAngle);
    this.dx = rotated[0];
    this.dy = rotated[1];
  }

  // if the thruster is on, apply acceleration
  // TODO: Remove the constant acceleration factor 10
  if(this.thrusterOn) {
    this.vx += this.dx * dt * 50;
    this.vy += this.dy * dt * 50;
  }

  // apply deceleration from friction
  this.vx *= Math.pow(this.options.friction, dt);
  this.vy *= Math.pow(this.options.friction, dt);
};

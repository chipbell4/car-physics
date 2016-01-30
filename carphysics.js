var CarPhysics = function(options) {
  // provide some defaults
  this.options = options || {};
  this.options.top_speed = this.options.top_speed || 400;
  this.options.acceleration = this.options.acceleration || 250;
  this.options.handling = this.options.handling || 5;
  this.options.traction = this.options.traction || 1;
  this.options.friction = this.options.friction || 0.2;

  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.dx = 0;
  this.dy = -1;
  this.turnDirection = 0;

  this.thrusterOn = false;
};

CarPhysics.BEST_TURN_SPEED = 0.75; // As a fraction of top speed
CarPhysics.TURN_AT_TOP_SPEED = 0.75 // As a fraction of this.options.handling


CarPhysics.prototype.rotateVector = function(x, y, radians) {
  var cosTheta = Math.cos(radians);
  var sinTheta = Math.sin(radians);

  return [
    cosTheta * x - sinTheta * y,
    cosTheta * y + sinTheta * x
  ];
};

CarPhysics.prototype.magnitude = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

CarPhysics.prototype.update = function(dt) {
  // update position based on velocity
  this.x += this.vx * dt;
  this.y += this.vy * dt;

  this.updateTurn(dt);
  this.applyAcceleration(dt);
  this.applyFriction(dt);
};

CarPhysics.prototype.updateTurn = function(dt) {
  if(this.turnDirection == 0) {
    return;
  }
    
  // if we're turning, apply a turn direction by rotating the D vector
  var rotationalVelocity = 0;
  // base the amount of rotation based on speed. (See the constants above)
  var currentSpeed = this.magnitude(this.vx, this.vy);
  if(currentSpeed / this.options.top_speed < CarPhysics.BEST_TURN_SPEED) {
    rotationalVelocity = (currentSpeed / this.options.top_speed / CarPhysics.BEST_TURN_SPEED) * this.options.handling;
  }

  // set rotation velocity based on turn direction
  rotationalVelocity *= this.turnDirection;

  var rotated = this.rotateVector(this.dx, this.dy, rotationalVelocity * dt);
  this.dx = rotated[0];
  this.dy = rotated[1];
};

CarPhysics.prototype.applyAcceleration = function(dt) {
  // If the thruster is off, break out
  if(!this.thrusterOn) {
    return;
  }

  // If we're at the top speed don't accelerate
  if(this.magnitude(this.vx, this.vy) >= this.options.top_speed) {
    return;
  }

  this.vx += this.dx * dt * this.options.acceleration;
  this.vy += this.dy * dt * this.options.acceleration;
};

CarPhysics.prototype.applyFriction = function(dt) {
  this.vx *= Math.pow(1 - this.options.friction, dt);
  this.vy *= Math.pow(1 - this.options.friction, dt);
};

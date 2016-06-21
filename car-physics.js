var CarPhysics = function(options) {
  // provide some defaults
  this.options = options || {};
  this.options.top_speed = this.options.top_speed || 400;
  this.options.acceleration = this.options.acceleration || 250;
  this.options.handling = this.options.handling || 3;
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
CarPhysics.TURN_AT_TOP_SPEED = 0.75; // As a fraction of this.options.handling

var rotateVector = function(x, y, radians) {
  var cosTheta = Math.cos(radians);
  var sinTheta = Math.sin(radians);

  return [
    cosTheta * x - sinTheta * y,
    cosTheta * y + sinTheta * x
  ];
};

var magnitude = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

CarPhysics.prototype.update = function(dt) {
  this.applyVelocity(dt);
  this.updateTurn(dt);
  this.applyAcceleration(dt);
  this.applyFriction(dt);
  this.applyTraction(dt);
};

CarPhysics.prototype.updateTurn = function(dt) {
  // if we're turning, apply a turn direction by rotating the D vector
  var rotationalVelocity = 0;
  // base the amount of rotation based on percentage of top speed. (See the constants above)
  var percentageSpeed = magnitude(this.vx, this.vy) / this.options.top_speed;

  if(percentageSpeed < CarPhysics.BEST_TURN_SPEED) {
    rotationalVelocity = percentageSpeed / CarPhysics.BEST_TURN_SPEED * this.options.handling;
  } else {
    // Handling decreases from full handling to a percentage at top speed.
    var slope = this.options.handling * (1 - CarPhysics.TURN_AT_TOP_SPEED) / (CarPhysics.BEST_TURN_SPEED - 1);
    var intercept = this.options.handling - slope * CarPhysics.BEST_TURN_SPEED;
    rotationalVelocity = intercept + slope * percentageSpeed;
  }

  // set rotation velocity based on turn direction
  rotationalVelocity *= this.turnDirection;

  var rotated = rotateVector(this.dx, this.dy, rotationalVelocity * dt);
  this.dx = rotated[0];
  this.dy = rotated[1];
};

CarPhysics.prototype.applyVelocity = function(dt) {
  this.x += this.vx * dt;
  this.y += this.vy * dt;
};

CarPhysics.prototype.applyAcceleration = function(dt) {
  // If the thruster is off, break out
  if(!this.thrusterOn) {
    return;
  }

  // If we're at the top speed don't accelerate
  if(magnitude(this.vx, this.vy) >= this.options.top_speed) {
    return;
  }

  this.vx += this.dx * dt * this.options.acceleration;
  this.vy += this.dy * dt * this.options.acceleration;
};

CarPhysics.prototype.applyFriction = function(dt) {
  // Dont apply friction if the thruster is on
  if(this.thrusterOn) {
    return;
  }

  this.vx *= Math.pow(1 - this.options.friction, dt);
  this.vy *= Math.pow(1 - this.options.friction, dt);
};

CarPhysics.prototype.applyTraction = function(dt) {
  // if the car isn't moving, break out
  if(magnitude(this.vx, this.vy) < 0.001) {
    return;
  }

  // calculate the angle between the direction and velocity vector (using the cross product)
  var dCrossV = this.dx * this.vy - this.vx * this.dy;
  var sinTheta = dCrossV / magnitude(this.dx, this.dy) / magnitude(this.vx, this.vy);
  var theta = Math.asin(sinTheta);

  // traction is an angular velocity that will determine how quickly the velocity vector can realign with direction
  // (just like tires do).
  var amountToCorrect = dt * this.options.traction * -Math.sign(theta);
  
  // If the amount of correction needed is less that what traction could do, we'll just realign
  if(Math.abs(theta) < amountToCorrect) {
    amountToCorrect = -theta; 
  }

  // now "fix" velocity by rotating it a little
  var rotated = rotateVector(this.vx, this.vy, amountToCorrect);
  this.vx = rotated[0];
  this.vy = rotated[1];
};

if(typeof window !== 'undefined') {
  window.CarPhysics = CarPhysics;
}
if(typeof module !== 'undefined') {
  module.exports = CarPhysics;
}

# Car Physics
A fun little car physics engine! Here's an example usage:
```javascript
var options = {
  top_speed: 100, // top speed
  acceleration: 200, // how fast the car accelerates
  handling: 3, // how fast the car can turn
  traction: 1, // how quickly the car stops drifting (tire stickiness)
  friction: 0.5 // the friction of the surface, i.e. how much percentage speed is lost per second
};
var physics = new CarPhysics(options);

// dt is the delta time (in seconds) between frames. Hopefully around 1 / 60...
var doFrame = function(dt) {
  // update car state, based on keyboard. Assume some booleans exist...
  physics.turnDirection = 0;
  if(leftArrowKeyPressed) {
    physics.turnDirection = -1;
  } else if(rightArrowKeyPressed) {
    physics.turnDirection = 1;
  }

  physics.thrusterOn = false;
  if(spaceBarPressed) {
    physics.thrusterOn = true;
  }

  // tell the physics engine to update position
  physics.update(dt);

  // now move some sprite carSprite (I assume it exists)
  carSprite.position.x = physics.x;
  carSprite.position.y = physics.y;

  // now, set the direction of the car
  directionAngle = Math.atan2(physics.vy, physics.vx);
  carSprite.rotation = directionAngle;
};
```

class Boid {
  constructor(posX = random(width), posY = random(height)) {
    this.position = createVector(posX, posY);
    this.velocity = createVector(4, 10);
    this.velocity.setMag(random(2, 0));
    this.acceleration = createVector();
    this.maxForce = 0.03;
    this.maxSpeed = 3;
    this.test = false;
    this.rotation = random(2, 5);
    this.maxFleeForce = 0.1;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height
    }
  }

  patternize(boids, predator = null) {
    let cohesion = this.cohesion(boids)
    let alignment = this.align(boids);
    let separation = this.separation(boids);
    if (predator) {
      let flee = this.flee(predator)

      this.acceleration.add(flee)
    }
    separation.mult(separationSlider.value())
    cohesion.mult(cohesionSlider.value())
    alignment.mult(alignmentSlider.value())
    this.acceleration.add(separation)
    this.acceleration.add(cohesion);
    this.acceleration.add(alignment)
  }


  scare(boids) {
    this.acceleration.add(this.separation(boids).mult(50))
    this.alignment.mult(0)
    this.cohesion.mult(0)
    this.acceleration.add(separation)
    console.log("scared")
  }

  reset(boids) {
    let separation = this.separation(boids)
    separation.sub(50)
    this.acceleration.sub(separation)
  }

  align(boids) {
    let perceptionRadius = 50
    let steeringForce = createVector();
    let total = 0;
    for (let other of boids) {
      // rotate(this.position.angleBetween(other.position))
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (d < perceptionRadius && other != this) {
        steeringForce.add(other.velocity)
        total++
      }


      // let v = p5.Vector.fromAngle(this.acceleration.angleBetween(other.acceleration), 30)
      // let vx = v.x;
      // let vy = v.y;
      // line(0, 0, 30, 0);
      // stroke(2);
      // line(0, 0, vx, vy);

    }
    if (total > 0) {
      steeringForce.div(total)
      steeringForce.setMag(this.maxSpeed)
      steeringForce.sub(this.velocity)
      steeringForce.limit(this.maxForce)
    }
    return steeringForce;
  }



  cohesion(boids) {
    let perceptionRadius = 50
    let steeringForce = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (this.position.angleBetween(other.position) < -90 || this.position.angleBetween(other.position) > 90) {
        return steeringForce
      }
      if (d < perceptionRadius && other != this) {
        steeringForce.add(other.position)
        total++
      }
    }
    if (total > 0) {
      steeringForce.div(total)
      steeringForce.sub(this.position)
      // steeringForce.setMag(this.maxSpeed)
      steeringForce.sub(this.velocity)
      steeringForce.limit(this.maxForce)
    }
    return steeringForce;
  }

  separation(boids) {
    let perceptionRadius = 50
    let steeringForce = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (this.position.angleBetween(other.position) < -90 || this.position.angleBetween(other.position) > 90) {
        return steeringForce
      }
      if (d < perceptionRadius && other != this) {

        let diff = p5.Vector.sub(this.position, other.position)
        diff.div(d)
        steeringForce.add(diff)
        total++
      }
    }
    if (total > 0) {
      steeringForce.div(total)
      steeringForce.setMag(this.maxSpeed)
      steeringForce.sub(this.velocity)
      steeringForce.limit(this.maxForce)
    }
    return steeringForce;
  }

  flee(predator) {
    let perceptionRadius = 70
    let steeringForce = createVector();
    let total = 0;
    let d = dist(
      this.position.x,
      this.position.y,
      predator.position.x,
      predator.position.y
    );

    if (d > perceptionRadius) {
      return
    } else {
      let diff = p5.Vector.sub(this.position, predator.position)
      diff.div(d)
      steeringForce.add(diff)
      total++
    }

    if (total > 0) {
      steeringForce.div(total)
      steeringForce.setMag(this.maxSpeed)
      steeringForce.sub(this.velocity)
      steeringForce.limit(this.maxFleeForce)
    }
    // this.separation = steeringForce
    return steeringForce;
  }

  update() {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.acceleration.mult(0)
  }
  show() {
    let theta = this.velocity.heading() + radians(90);
    fill(127);
    stroke(200);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.rotation * 2);
    vertex(-this.rotation, this.rotation * 2);
    vertex(this.rotation, this.rotation * 2);
    endShape(CLOSE);
    pop();
  }
}
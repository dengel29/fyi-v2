let sketch = function (p) {
  let flock = [];
  let d;
  let predator;
  let x;
  let y;

  let cohesionSlider, alignmentSlider, separationSlider;
  p.setup = function () {
    d = '#f3fffd'
    CANVAS = p.createCanvas(640, 360);
    // alignmentSlider = p.createSlider(0, 5, 1, 0.1);
    // cohesionSlider = p.createSlider(0, 5, 1, 0.1);
    // separationSlider = p.createSlider(0, 5, 1, 0.1);

    class Boid {
      constructor(posX = p.random(CANVAS.width), posY = p.random(CANVAS.height)) {
        this.position = p.createVector(posX, posY);
        this.velocity = p.createVector(4, 10);
        this.velocity.setMag(p.random(2, 0));
        this.acceleration = p.createVector();
        this.maxForce = 0.03;
        this.maxSpeed = 3;
        this.test = false;
        this.rotation = p.random(2, 5);
        this.maxFleeForce = 0.1;
      }

      edges() {
        if (this.position.x > CANVAS.width) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = CANVAS.width
        }
        if (this.position.y > CANVAS.height) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = CANVAS.height
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
        // separation.mult(separationSlider.value())
        // cohesion.mult(cohesionSlider.value())
        // alignment.mult(alignmentSlider.value())
        alignment.mult(0.8)
        cohesion.mult(2.7)
        separation.mult(2.8);
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
        let steeringForce = p.createVector();
        let total = 0;
        for (let other of boids) {
          // rotate(this.position.angleBetween(other.position))
          let d = p.dist(
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
        let steeringForce = p.createVector();
        let total = 0;
        for (let other of boids) {
          let d = p.dist(
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
        let steeringForce = p.createVector();
        let total = 0;
        for (let other of boids) {
          let d = p.dist(
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
        let steeringForce = p.createVector();
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
        let theta = this.velocity.heading() + p.radians(90);
        p.fill('#1f567a');
        p.stroke(200);
        p.push();
        p.translate(this.position.x, this.position.y);
        p.rotate(theta);
        p.beginShape();
        p.vertex(0, -this.rotation * 2);
        p.vertex(-this.rotation, this.rotation * 2);
        p.vertex(this.rotation, this.rotation * 2);
        p.endShape(p.CLOSE);
        p.pop();
      }
    }

    class Predator {
      constructor(posX, posY) {
        this.position = p.createVector(posX, posY)
      }

      update(posX, posY) {
        this.position = p.createVector(posX, posY)
      }
      show(posX, posY) {
        p.ellipse(posX, posY, 20)
      }
    }

    for (i = 0; i < 75; i++) {
      flock.push(new Boid())
    }

    // CANVAS.mouseOut(() => {
    //   d = 41
    // })
  }


  p.draw = function () {
    CANVAS.background(d)

    for (let boid of flock) {
      boid.edges()
      if (predator) {
        predator.update(x, y);
        predator.show(x, y);
        boid.patternize(flock, predator)
      } else {
        boid.patternize(flock)
      }
      boid.update()
      boid.show()
    }
  }
}
new p5(sketch, 'sketch-container')

let c = document.getElementsByTagName('canvas')[0]
c.width = '100%'
c.height = '100%'
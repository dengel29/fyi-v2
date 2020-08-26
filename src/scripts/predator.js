class Predator {
  constructor(posX, posY) {
    this.position = createVector(posX, posY)
  }

  update(posX, posY) {
    this.position = createVector(posX, posY)
  }
  show(posX, posY) {
    ellipse(posX, posY, 20)
  }
}
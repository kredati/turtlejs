class Turtle {

  constructor (x, y) {
    this.position = new p5.Vector(x, y)
    this.triangle = new DirectionalTriangle(10)
    this.heading = radians(-90)
    this.path = []
  }

  display () {
    background(0)
    this.triangle.render(this.position, this.heading)
  }

  forward (distance) {
    let movement = new p5.Vector(distance)

    movement.rotate(this.heading)

    this.position = this.position.add(movement)

    return this
  }

  right (degrees) {
    let rotation = radians(degrees)

    this.heading += rotation

    return this
  }

  left (degrees) {
    let rotation = radians(degrees)

    this.heading -= rotation

    return this
  }

  turn (degrees) {
    let rotation = radians(degrees)

    this.heading += rotation

    return this
  }

  repeat (times, doIt) {
    for (let i = 1; i < times; ++i) {
      doIt()
    }

    return this
  }

}

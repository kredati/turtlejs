(turtlejs => {

turtlejs.Turtle = class Turtle {

  constructor (x = width / 2, y = height / 2) {
    this.origin = new p5.Vector(x, y)
    this.originalHeading = radians(-90)

    this.position = this.origin.copy()
    this.heading = this.originalHeading

    this.triangle = new turtlejs.Triangle(15)

    this.path = new turtlejs.Path()
    this.path.addNode(this.position)

    this.hud = new turtlejs.HUD(this)
  }

  render () {
    background(0)
    this.path.render()
    this.triangle.render(this.position, this.heading)

    this.hud.update().render()
  }

  jump (distance = 0) {
    let movement = new p5.Vector(distance).rotate(this.heading)

    this.position = this.position.add(movement)
    this.path.newSegment(this.position)

    return this
  }

  forward (distance = 0) {
    let movement = new p5.Vector(distance).rotate(this.heading)

    this.position = this.position.add(movement)
    this.path.addNode(this.position)

    return this
  }

  back (distance = 0) {
    return this.forward(distance * -1)
  }

  home () {
    this.position = this.origin.copy()
    this.heading = this.originalHeading

    this.path.newSegment(this.position)

    return this
  }

  right (degrees = 0) {
    return this.turn(degrees)
  }

  left (degrees = 0) {
    return this.turn(degrees * -1)
  }

  turn (rotation = 0) {
    let headingInDegrees = degrees(this.heading)

    this.heading = radians((headingInDegrees + rotation) % 360)

    return this
  }

  erase () {
    this.path = new turtlejs.Path()
    this.path.addNode(this.position)

    return this
  }

  reset () {
    this.home()

    background(0)

    return this.erase()
  }

  pathColor (...args) {
    this.path.setColor(color(...args))

    return this
  }

  report () {
    let xPos = Math.round(this.position.x),
      yPos = Math.round(this.position.y),
      heading = Math.round(degrees(this.heading) + 90)

    if (heading < 0) heading += 360

    console.log(`Turtle is at (${xPos}, ${yPos}).`)
    console.log(`Turtle is facing ${heading}.`)
  }

}

})(window.turtlejs)

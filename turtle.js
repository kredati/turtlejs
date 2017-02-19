class Turtle {

  constructor (x = 0, y = 0) {
    this.origin = new p5.Vector(x, y)
    this.originalHeading = radians(-90)

    this.position = this.origin.copy()
    this.heading = this.originalHeading

    this.triangle = new DirectionalTriangle(15)

    this.path = new Path()
    this.path.addNode(this.position)

    this.methods = {
      'back': this.back,
      'erase': this.erase,
      'forward': this.forward,
      'help': this.help,
      'home': this.home,
      'jump': this.jump,
      'left': this.left,
      'report': this.status,
      'right': this.right,
      'turn': this.turn
    }
  }

  render () {
    background(0)
    this.path.render()
    this.triangle.render(this.position, this.heading)
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
    this.path = new Path()
    this.path.addNode(this.position)

    return this
  }

  reset () {
    this.home()

    background(0)

    return this.erase()
  }

  status () {
    let xPos = Math.round(this.position.x),
      yPos = Math.round(this.position.y),
      heading = Math.round(degrees(this.heading) + 90)

    console.log(`Turtle is at (${xPos}, ${yPos}).`)
    console.log(`Turtle is facing ${heading}.`)
  }

  help () {
    console.log('Here is what you can tell me to do:')
    let methodList = ''

    for (let method in this.methods) {
      if ({}.hasOwnProperty.call(this.methods, method)) {
        if (methodList !== '') methodList = `${methodList}, `
        methodList = `${methodList}${method}()`
      }
    }
    methodList = `${methodList}.`
    console.log(methodList)
  }

  exportMethods (bindTo) {
    let exportMethods = {}

    for (let method in this.methods) {
      if ({}.hasOwnProperty.call(this.methods, method))
        exportMethods[method] = this.methods[method].bind(this)
    }

    Object.assign(bindTo, exportMethods)

    return bindTo
  }

}

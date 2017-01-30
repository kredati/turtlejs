class Turtle {

  constructor (x = 0, y = 0) {
    this.position = new p5.Vector(x, y)
    this.triangle = new DirectionalTriangle(15)
    this.heading = radians(-90)

    this.path = new Path()
    this.path.addNode(this.position)

    this.methods = {
      'erase': this.erase,
      'forward': this.forward,
      'help': this.help,
      'jump': this.jump,
      'left': this.left,
      // 'repeat': this.repeat,
      'report': this.status,
      'reset': this.reset,
      'right': this.right,
      'turn': this.turn
    }
  }

  display () {
    background(0)
    noStroke()

    this.path.render()
    this.triangle.render(this.position, this.heading)
  }

  finishMove () {
    // console.log(this.status())

    return this
  }

  goTo (x = width/2, y = height/2) {
    this.position = new p5.Vector(x, y)

    return this.finishMove()
  }

  jump (distance = 0) {
    let movement = new p5.Vector(distance).rotate(this.heading)

    this.position = this.position.add(movement)

    this.path.newSegment(this.position)

    return this.finishMove()
  }

  forward (distance = 0) {
    let movement = new p5.Vector(distance).rotate(this.heading)

    this.position = this.position.add(movement)
    this.path.addNode(this.position)

    return this.finishMove()
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

    return this.finishMove()
  }

  repeat (times = 0, doIt) {
    for (let i = 0; i < times; ++i) {
      doIt()
    }

    return this.finishMove()
  }

  erase () {
    this.path = new Path()
    this.path.addNode(this.position)

    return this.finishMove()
  }

  reset () {
    this.position = new p5.Vector(width/2, height/2)
    this.heading = radians(-90)

    console.clear()

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

  makeGlobal () {
    this.exportMethods(window)
  }

}

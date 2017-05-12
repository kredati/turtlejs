// Draws a triangle of specified size, pointing in the specified heading
// Adapted freely from Dan Shiffman's flocking/boids from The Nature of Code
(turtlejs => {

  let composeInstance = (proto, ...opts) =>
    Object.assign(Object.create(proto), ...opts)

  let composeInitializedInstance = (proto, init, ...opts) =>
    composeInstance(proto, {init}, ...opts).init()

  let Triangle = {
    buildTriangle () {
      let vertices = [],
        triAngle = this.angle,
        radius = this.radius

      vertices.push(new p5.Vector(radius, 0))
      vertices.push(new p5.Vector(radius, 0).rotate(triAngle))
      vertices.push(new p5.Vector(radius, 0).rotate(-triAngle))

      this.vertices = vertices
    },

    render (position, heading) {
      fill(this.fillColor)
      noStroke()

      push()
        translate(position.x, position.y)
        rotate(heading)
        this.drawTriangle()
      pop()
    },

    drawTriangle () {
      beginShape()
      this.vertices.forEach(vertice => vertex(vertice.x, vertice.y))
      endShape(CLOSE)
    }
  }

  let init = function () {
    this.buildTriangle()

    return this
  }

  let composeTriangle = props =>
    composeInitializedInstance(Triangle, init, props)

  let create = radius => {
    let props = {
      radius,
      'fillColor': color(150, 150, 150, 200),
      'angle': radians(140)
    }

    return composeTriangle(props)

  }

  turtlejs.triangle = {create}

})(window.turtlejs)

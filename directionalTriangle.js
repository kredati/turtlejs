// Draws a triangle of specified size, pointing in the specified heading
// Adapted freely from Dan Shiffman's flocking/boids from The Nature of Code
class DirectionalTriangle {

  constructor (radius) {
    this.radius = radius
    this.fillColor = color(150, 150, 150, 200)

    this.buildTriangle()
  }

  buildTriangle () {
    let vertices = [],
      triAngle = radians(140),
      radius = this.radius

    vertices.push(new p5.Vector(radius, 0))
    vertices.push(new p5.Vector(radius, 0).rotate(triAngle))
    vertices.push(new p5.Vector(radius, 0).rotate(-triAngle))

    this.vertices = vertices
  }

  render (position, heading) {
    fill(this.fillColor)
    noStroke()

    push()
      translate(position.x, position.y)
      rotate(heading)
      this.drawTriangle()
    pop()
  }

  drawTriangle () {
    beginShape()
    this.vertices.forEach(vertice => vertex(vertice.x, vertice.y))
    endShape(CLOSE)
  }

}

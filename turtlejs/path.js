class Path {

  constructor () {
    this.lines = []
    this.currentSegment = []
    this.currentColor = color(200, 200, 200, 255)
    this.lines.push(this.currentSegment)
  }

  render () {
    stroke(200, 200, 200, 255)
    strokeWeight(1)

    this.lines.forEach(Path.drawSegment)

    return this
  }

  addNode (location) {
    let node = Path.composeNode(location.copy(), this.currentColor)

    this.currentSegment.push(node)

    return this
  }

  newSegment (origin) {
    let newSegment = []

    this.currentSegment = newSegment
    this.lines.push(this.currentSegment)

    if (origin) this.addNode(origin)

    return this
  }

  setColor (...args) {
    this.currentColor = color(...args)

    return this
  }

  static drawSegment (segment) {
    segment.forEach(Path.drawLine)
  }

  static drawLine (node, index, segment) {
    if (index) {
      let previousNode = segment[index-1]

      stroke(node.color)

      line(node.location.x,
        node.location.y,
        previousNode.location.x,
        previousNode.location.y)
    }
  }

  static composeNode (location, color) {
    return {location, color}
  }

}

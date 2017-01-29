class Path {

  constructor () {
    this.lines = []
    this.currentSegment = []
    this.lines.push(this.currentSegment)
  }

  render () {
    stroke(255, 255, 255, 200)
    strokeWeight(1)

    this.lines.forEach(Path.drawSegment)

    return this
  }

  static drawSegment (segment) {
    segment.forEach(Path.drawLine)
  }

  static drawLine (node, index, segment) {
    if (index) {
      let previousNode = segment[index-1]

      line(node.x, node.y, previousNode.x, previousNode.y)
    }
  }

  addNode (vector) {
    this.currentSegment.push(vector.copy())

    return this
  }

  newSegment (origin) {
    let newSegment = []

    this.currentSegment = newSegment
    this.lines.push(this.currentSegment)

    if (origin) this.addNode(origin)

    return this
  }

}

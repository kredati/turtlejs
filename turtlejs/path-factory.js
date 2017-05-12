(turtlejs => {

  // helper factory functions
  let composeInstance = (proto, ...opts) =>
    Object.assign(Object.create(proto), ...opts)

  let composeInitializedInstance = (proto, init) => (...opts) =>
    init.apply(composeInstance(proto, ...opts))

  // helper functions for paths
  let composeNode = (location, color) => ({location, color})

  let drawLine = (node, index, segment) => {
    if (index) {
      let previousNode = segment[index-1]

      stroke(node.color)

      line(node.location.x,
        node.location.y,
        previousNode.location.x,
        previousNode.location.y)
    }
  }

  let drawSegment = segment => { segment.forEach(drawLine) }

  // Path prototype
  let Path = {
    render () {
      stroke(200, 200, 200, 255)
      strokeWeight(1)

      this.lines.forEach(drawSegment)

      return this
    },

    addNode (location) {
      let node = composeNode(location.copy(), this.currentColor)

      this.currentSegment.push(node)

      return this
    },

    newSegment (origin) {
      let newSegment = []

      this.currentSegment = newSegment
      this.lines.push(this.currentSegment)

      if (origin) this.addNode(origin)

      return this
    },

    setColor (...args) {
      this.currentColor = color(...args)

      return this
    }
  }

  // an init function for setup
  let init = function () {
    this.lines.push(this.currentSegment)

    return this
  }

  let composePath = composeInitializedInstance(Path, init)

  // and finally, a factory function
  let create = () => {
    let props = {
      'currentSegment': [],
      'lines': [],
      'currentColor': color(200, 200, 200, 255)
    }

    return composePath(props)
  }

  // export factory function
  turtlejs.path = {create}

})(window.turtlejs)

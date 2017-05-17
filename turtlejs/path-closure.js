(turtlejs => {

  let util = turtlejs.util

  // define internal functions for paths
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

  let renderLines = lines => {
    stroke(200, 200, 200, 255).strokeWeight(1)
    lines.forEach(drawSegment)
  }

  let addNodeTo = (location, segment, color) => {
    segment.push(composeNode(location.copy(), color))
  }

  let createSegment = origin => {
    let segment = []

    addNodeTo(origin, segment, color(0, 0, 0, 0))

    return segment
  }

  let create = () => {
    // set state variables
    let currentSegment = [],
      lines = [],
      currentColor = color(200, 200, 200, 255)

    // do any setup
    lines.push(currentSegment)

    // define api functions
    let render = () => renderLines(lines)

    let newSegment = origin => {
      currentSegment = createSegment(origin)
      lines.push(currentSegment)
    }

    let addNode = location => {
      addNodeTo(location, currentSegment, currentColor)
    }

    let setColor = (...args) => {
      console.log(...args)
      currentColor = color(...args)
    }

    // export api functions
    return util.exports({
      render,
      newSegment,
      addNode,
      setColor
    })

  }

  // export factory function
  turtlejs.path = {create}

})(window.turtlejs)

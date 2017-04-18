(turtlejs => {

turtlejs.Renderer = class Renderer {

  constructor () {
    this.path = []

    this.speed = 2
  }

  render () {
    let [first, ...rest] = this.frames

    this.frames = rest

    first.render()

    return this
  }

  addNode (vector) {
    this.path.push(vector.copy())
  }

  /*
    Now I get it:
    Use recursion and destructuring or slice
    Effectively, this is a complex reduce operation
    You get to the tween position:
      Go until the distance you've traveled has exceeded speed
      Once you're greater, scale the last segment to get the speed correct
      Forward the segments array, with the first element being the last frame
      Return the stack of frames
  */
  static composeFrameFromSegments (segments, speed, frames = []) {

  }

  static segmentsLength (segments) {
    return segments.reduce((length, segment) => {
      return length + segment.mag()
    }, 0)
  }

  static composeSegmentFrames (first, second, speed) {
    let segmentLength = p5.Vector.dist(first, second),
      frames = []

    if (segmentLength < speed)
      throw new Error('Segment is shorter than speed')

    let tween = Renderer.calculateTween(first, second, speed)

    frames.push(p5.Vector.add(first, tween))

    while (p5.Vector.dist(frames.last(), second) > speed)
      frames.push(p5.Vector.add(frames.last(), tween))

    frames.push(second.copy())

    return frames
  }

  static calculateTween (first, second, speed) {
    let segmentDistance = p5.Vector.dist(first, second),
      tweenFrames = Math.round(segmentDistance/speed),
      tweenDistance = segmentDistance/tweenFrames

    return p5.Vector.sub(second, first).setMag(tweenDistance)
  }

  static pathLength (path) {
    return path.reduce((accumulator, node) => {
      if (accumulator.previous)
        accumulator.length += node.dist(accumulator.previous)

      accumulator.previous = node

      return accumulator
    }, {'length': 0}).length
  }
}

})(window.turtlejs)

var commandCenter

var setup = () => {
  createCanvas(600, 500)
  commandCenter = new TurtleCommandCenter()
}

var draw = () => {
  background(0)
  commandCenter.executeStack()
}

var turtle,
  commandCenter

var setup = () => {
  createCanvas(600, 500)
  background(0)

  turtle = new Turtle(width/2, height/2)
  commandCenter = new TurtleCommandCenter(turtle)

  turtle.render()
}

var draw = () => {
  commandCenter.executeStack()
}

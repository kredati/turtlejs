var turtle,
  commandCenter

var setup = () => {
  createCanvas(600, 500)
  turtle = new Turtle(width/2, height/2)
  commandCenter = new TurtleCommandCenter(turtle)
}

var draw = () => {
  commandCenter.executeStack()
  turtle.display()
}

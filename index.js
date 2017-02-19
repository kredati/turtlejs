var turtle,
  commandCenter

var setup = () => {
  createCanvas(600, 500)
  background(0)

  turtle = new Turtle(width/2, height/2)
  commandCenter = new TurtleCommandCenter(turtle)

  console.log('Welcome to TurtleJS!\nFor help, type help() and press enter.')
  turtle.render()
}

var draw = () => {
  commandCenter.executeStack()
}

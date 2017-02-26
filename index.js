new p5()

var turtle,
  commandCenter

var setup = () => {
  createCanvas(600, 500)
  background(0)

  turtle = new Turtle(width/2, height/2)
  commandCenter = new TurtleCommandCenter(turtle)

  language.composeGlobalContext(commandCenter)

  console.log('Welcome to TurtleJS!\nFor help, type help() and press enter.')
  turtle.render()

  console.log('Turtle ready!')
}

var draw = () => {
  commandCenter.executeStack()
}

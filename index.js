new p5()

var turtle,
  commandCenter

var setup = () => {
  createCanvas(600, 500)
  background(0)

  turtle = new turtlejs.Turtle()
  commandCenter = new turtlejs.TurtleCommandCenter(turtle)

  turtlejs.language.composeGlobalContext(commandCenter)

  console.log('Welcome to TurtleJS!\nFor help, type help() and press enter.')

  turtle.render()

  console.log('Turtle ready!')
}

var draw = () => {
  commandCenter.executeStack()
  turtlejs.listener.listen()
}

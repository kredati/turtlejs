var turtle,
  commands = []

var setup = () => {
  createCanvas(600, 500)
  turtle = new Turtle(width/2, height/2)
  // turtle.makeGlobal()
  TurtleCommand.exportGlobals(turtle, commands)
}

var draw = () => {
  if (commands[0]) commands[0].execute()
  commands.splice(0, commands.length)

  turtle.display()
}

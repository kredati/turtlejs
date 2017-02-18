var turtle,
  commandCenter,
  undoStack = [],
  redoStack = []

var ready = () => { console.log('Turtle ready!') }

var undo = (steps = 1) => {
  let stack = undoStack.slice(0, undoStack.length - steps)

  redoStack = undoStack.slice(undoStack.length - steps - 1, undoStack.length)
  undoStack = stack

  turtle.reset()
  undoStack.forEach(command => command.toExecute())
  turtle.render()
}

var setup = () => {
  createCanvas(600, 500)
  background(0)
  turtle = new Turtle(width/2, height/2)
  commandCenter = new TurtleCommandCenter(turtle)

  turtle.render()
  ready()
}

var draw = () => {
  commandCenter.executeStack()
}

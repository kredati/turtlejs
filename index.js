var commandCenter

var ready = () => { console.log('Turtle ready!') }

var setup = () => {
  createCanvas(600, 500)
  background(0)
  commandCenter = new TurtleCommandCenter()
  ready()
}

var draw = () => {
  commandCenter.executeStack()
}

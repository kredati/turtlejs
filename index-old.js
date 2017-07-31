new p5()

let turtle,
  commandCenter

let startupMessage = (() => {
  let bigMessage = `To get started, open Chrome developer tools:
  On a Mac: command+option+i.
  On a PC: control+shift+i.`

  let smallMessage = `(Once you do that, type any turtle command to begin.)`

  let display = () => {
    textStyle(NORMAL)
    textSize(20)
    textAlign(CENTER)
    stroke(255, 255, 255, 255)
    fill(255, 255, 255, 255)
    text(bigMessage, width/2, height/2)
    textSize(12)
    text(smallMessage, width/2, height/2 + 150)
  }

  return {display}

})()

var setup = () => {
  createCanvas(600, 500)
  background(0)

  turtle = new turtlejs.Turtle(width/2, height/2)
  commandCenter = new turtlejs.TurtleCommandCenter(turtle)

  turtlejs.language.composeGlobalContext(commandCenter)

  console.log('Welcome to TurtleJS!\nFor help, type help() and press enter.')

  turtle.render()

  console.log('Turtle ready!')

  startupMessage.display()
}

var draw = () => {
  commandCenter.executeStack()
  turtlejs.listener.listen()
}

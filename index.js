var turtle

var setup = () => {
  createCanvas(600, 500)
  turtle = new Turtle(width/2, height/2)
  turtle.makeGlobal()
}

var draw = () => {
  turtle.display()
}

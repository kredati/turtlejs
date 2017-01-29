var turtle

var setup = () => {
  createCanvas(800, 600)
  turtle = new Turtle(width/2, height/2)
}

var draw = () => {
  turtle.display()
}

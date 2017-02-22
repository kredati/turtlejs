var goTurtle = () => {
  learn('circle', repeat(360, forward(1).right(1)))

  learn('flower', repeat(45, circle().right(8)))

  repeat(4, flower().forward(100).right(90))
}

(turtlejs => {

  // helper (pure) functions
  let geometryToCompass = degs => (degs + 90 + 360)%360

  let radiansToCompass = rads => {
    let degs = Math.round(degrees(rads))

    return geometryToCompass(degs)
  }

  let createWithSelf = turtle => {

    let self = {},
      turtlePosition = turtle.position,
      turtleHeading = turtle.heading

    let update = () => {
      turtleHeading = turtle.heading

      return self
    }

    let render = () => {
      let xPos = Math.round(turtlePosition.x),
        yPos = Math.round(turtlePosition.y),
        positionText =
          `Position: (${xPos}, ${yPos}).`,
        headingText =
          `Heading: ${radiansToCompass(turtleHeading)}.`,
        HUDtext = `${positionText} ${headingText}`

      fill(255, 255, 255, 80)
      textSize(12)
      text(HUDtext, 5, height - 5)

      return self
    }

    return Object.assign(self, {update, render})

  }

  // some decorator helper functions
  let after = (main, decorator) => (...args) => decorator(main(...args))

  let before = (main, decorator) => (...args) => main(decorator(...args))

  let fluent = (fn, chainable) =>
    after(fn, result => result ? result : chainable)

  let exports = obj => {
    let toExport = {}

    Reflect.ownKeys(obj).forEach(key => {
      if (typeof obj[key] === 'function')
        toExport[key] = fluent(obj[key], toExport)
    })

    return toExport
  }

  let createWithDecoration = turtle => {
    let turtlePosition = turtle.position,
      turtleHeading = turtle.heading

    let update = () => {
      turtleHeading = turtle.heading
    }

    let render = () => {
      let xPos = Math.round(turtlePosition.x),
        yPos = Math.round(turtlePosition.y),
        positionText =
          `Position: (${xPos}, ${yPos}).`,
        headingText =
          `Heading: ${radiansToCompass(turtleHeading)}.`,
        HUDtext = `${positionText} ${headingText}`

      fill(255, 255, 255, 80)
      textSize(12)
      textAlign(LEFT)
      text(HUDtext, 5, height - 5)
    }

    return exports({update, render})
  }

  // export factory function
  turtlejs.HUD = {'create': createWithDecoration}

})(window.turtlejs)

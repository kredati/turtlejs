(turtlejs => {

  // factory helper functions
  let composeInstance = (proto, ...opts) =>
    Object.assign(Object.create(proto), ...opts)

  // helper (pure) functions
  let geometryToCompass = degs => (degs + 90 + 360)%360

  let radiansToCompass = rads => {
    let degs = Math.round(degrees(rads))

    return geometryToCompass(degs)
  }

  // describe prototype
  let HUD = {

    update () {
      this.turtlePosition = this.turtle.position
      this.turtleHeading = this.turtle.heading

      return this
    },

    render () {
      let xPos = Math.round(this.turtlePosition.x),
        yPos = Math.round(this.turtlePosition.y),
        positionText =
          `Position: (${xPos}, ${yPos}).`,
        headingText =
          `Heading: ${radiansToCompass(this.turtleHeading)}.`,
        HUDtext = `${positionText} ${headingText}`

      fill(255, 255, 255, 80)
      textSize(12)
      text(HUDtext, 5, height - 5)

      return this
    }
  }

  let composeHUD = props => composeInstance(HUD, props)

  let create = turtle => {
    let props = {turtle}

    return composeHUD(props)
  }

  // export factory function
  turtlejs.HUD = {create}

})(turtlejs)

(turtlejs => {

  turtlejs.HUD = class HUD {

    constructor (turtle) {

      this.turtle = turtle

    }

    update () {
      this.turtlePosition = this.turtle.position
      this.turtleHeading = this.turtle.heading

      return this
    }

    render () {
      let xPos = Math.round(this.turtlePosition.x),
        yPos = Math.round(this.turtlePosition.y),
        positionText =
          `Position: (${xPos}, ${yPos}).`,
        headingText =
          `Heading: ${HUD.radiansToCompass(this.turtleHeading)}.`,
        HUDtext = `${positionText} ${headingText}`

      fill(255, 255, 255, 80)
      textSize(12)
      text(HUDtext, 5, height - 5)

      return this
    }

    static radiansToCompass (rads) {
      let degs = Math.round(degrees(rads))

      return HUD.geometryToCompass(degs)
    }

    static geometryToCompass (degs) {
      let rotatedBy90 = (degs + 90 + 360)%360

      return rotatedBy90
    }

  }

})(turtlejs)

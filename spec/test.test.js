describe('A test test suite', () => {

  it('should run a test', () => {
    expect('a').toBe('a') // Hey Ayn Rand, how's it going?
  })

  it('should see the turtlejs object', () => {
    expect(turtlejs).toBeDefined()
  })

  it('should see the turtlejs submodules', () => {
    expect(turtlejs.util).toBeDefined()
    expect(turtlejs.triangle).toBeDefined()
    expect(turtlejs.path).toBeDefined()

    /* these three will be rewritten as modules
      expect(turtlejs.HUD).toBeDefined()
      expect(turtlejs.Turtle).toBeDefined()
      expect(turtlejs.TurtleCommand).toBeDefined()
    */

    expect(turtlejs.listener).toBeDefined()
    expect(turtlejs.language).toBeDefined()
  })

  xit('should be able to execute global commands', () => {
    // how to do this? Jasmine doesn't like it
    expect(reset()).not.toThrow()
  })

})

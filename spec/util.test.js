const util = require('../modules/util.js')

describe('TurtleJS core utilities', () => {
  it('should expose a complete API', () => {
    expect(util).toBeDefined()
    expect(util.is).toBeDefined()
    expect(util.functional).toBeDefined()
  })
})

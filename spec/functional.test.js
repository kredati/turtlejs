let f = require('../modules/functional')

describe('turtle.js functional helper functions', () => {
  it('should export the right API', () => {
    expect(f.before).toBeDefined()
    expect(f.after).toBeDefined()
    expect(f.compose).toBeDefined()
    expect(f.pipe).toBeDefined()
    expect(f.fluent).toBeDefined()
    expect(f.spreadable).toBeDefined()
    expect(f.maybe).toBeDefined()
    expect(f.map).toBeDefined()
    expect(f.reduce).toBeDefined()
    expect(f.filter).toBeDefined()
  })

  describe('include a before function that', () => {
    let add2 = (x) => x + 2,
      mult2 = (x) => x * 2,
      add2before = f.before(add2),
      add2thenMult2 = add2before(mult2),
      id = (arg) => arg,
      undefinedFn = () => undefined,
      undefinedBefore = f.before(undefinedFn)

    it('should return a function', () => {
      expect(typeof add2before).toBe('function')
    })

    it('should call a function before another function', () => {
      let mockFn = jest.fn(),
        genericBefore = f.before(mockFn),
        trueFn = () => true

      genericBefore(trueFn)()
      expect(mockFn).toHaveBeenCalled()
    })

    it('should pass on arguments if the decorator returns nothing', () => {
      expect(undefinedBefore(id)('passed')).toBe('passed')
    })

    it('should pass on multiple arguments if the decorator returns nothing', () => {
      let mockFn = jest.fn()

      undefinedBefore(mockFn)('passed', 2)
      expect(mockFn).toHaveBeenCalledWith('passed', 2)
    })

    it('should pass the result of the before function', () => {
      expect(add2before(id)(2)).toBe(4)
    })

    it('should correctly compute results of decorated functions', () => {
      expect(add2before(mult2)(2)).toBe(8)
      expect(add2before(mult2)(3)).toBe(10)
    })
  })

  describe('include an after function that', () => {
    let add2 = (x) => x + 2,
      mult2 = (x) => x * 2,
      add2after = f.after(add2),
      mult2thenAdd2 = add2after(mult2),
      id = (arg) => arg,
      undefinedFn = () => undefined

    it('should return a function', () => {
      expect(typeof add2after).toBe('function')
    })

    it('should call a function after another function', () => {
      let mockFn = jest.fn(),
        genericAfter = f.after(mockFn),
        trueFn = () => true

      genericAfter(trueFn)()
      expect(mockFn).toHaveBeenCalled()
    })

    it('should pass on arguments if the main function returns nothing', () => {
      let mockFn = jest.fn()

      f.after(mockFn)(undefinedFn)('passed')
      expect(mockFn).toHaveBeenCalledWith('passed')
    })

    it('should pass on multiple arguments if the decorator returns nothing', () => {
      let mockFn = jest.fn()

      f.after(mockFn)(undefinedFn)('passed', 2)
      expect(mockFn).toHaveBeenCalledWith('passed', 2)
    })

    it('should pass the result of the before function', () => {
      let mockFn = jest.fn()

      f.after(mockFn)(add2)(2)
      expect(mockFn).toHaveBeenCalledWith(4)
    })

    it('should correctly compute results of decorated functions', () => {
      expect(add2after(mult2)(2)).toBe(6)
      expect(add2after(mult2)(3)).toBe(8)
    })
  })

  describe('include a fluent function that', () => {
    let fluent

    beforeEach(() => {
      let undef = jest.fn(),
        id = jest.fn((arg) => arg)

      fluent = {}

      fluent.undef = f.fluent(fluent)(undef)
      fluent.id = f.fluent(fluent)(id)
    })

    it('should build functions', () => {
      expect(typeof fluent.undef).toBe('function')
      expect(typeof fluent.id).toBe('function')
    })

    it('should build functions that return correct values', () => {
      expect(fluent.id('passed')).toBe('passed')
    })

    it('should build functions that return the fluent object with no return value', () => {
      expect(fluent.undef('passed')).toEqual(fluent)
    })

    it('should build chainable functions', () => {
      expect(() =>
        fluent.undef('passed').undef('foo').undef(6).id('passed')
      ).not.toThrow()
      expect(fluent.undef('passed').undef('foo').undef(6).id('passed')).toBe(
        'passed'
      )
    })
  })

  describe('include a compose function that', () => {
    let add2 = (x) => x + 2,
      mult2 = (x) => x * 2,
      inc = (x) => x + 1

    it('should build functions', () => {
      let composed = f.compose(() => true)

      expect(typeof composed).toBe('function')
    })

    it('should compose two functions in reverse order of evaluation', () => {
      let composed = f.compose(add2, mult2)

      expect(composed(2)).toBe(6)
      expect(composed(1)).toBe(4)
      expect(composed(10)).toBe(22)
    })

    it('should compose many functions', () => {
      let composed = f.compose(inc, inc, inc, mult2, add2)

      expect(composed(2)).toBe(11)
    })
  })

  describe('include a pipe function that', () => {
    let add2 = (x) => x + 2,
      mult2 = (x) => x * 2,
      inc = (x) => x + 1

    it('should build functions', () => {
      let piped = f.pipe(() => true)

      expect(typeof piped).toBe('function')
    })

    it('should pipe two functions in order of evaluation', () => {
      let piped = f.pipe(add2, mult2)

      expect(piped(2)).toBe(8)
      expect(piped(1)).toBe(6)
      expect(piped(10)).toBe(24)
    })

    it('should pipe many functions', () => {
      let piped = f.pipe(inc, inc, inc, mult2, add2)

      expect(piped(2)).toBe(12)
    })
  })

  describe('includes a maybe function that', () => {
    let def = f.maybe('default')

    it('should build function with a default value', () => {
      expect(typeof def).toBe('function')
    })

    it('should return the default value when it gets no result', () => {
      expect(def(undefined)).toBe('default')
      expect(def(null)).toBe('default')
      expect(def(void 0)).toBe('default')
    })

    it('should return the passed value when it gets truthy results', () => {
      expect(def(2)).toBe(2)
      expect(def(true)).toBe(true)
      expect(def('truthy')).toBe('truthy')
      expect(def(['foo', 'bar'])).toEqual(['foo', 'bar'])
      expect(def({foo: 'bar'})).toEqual({foo: 'bar'})
    })

    it('should return the passed value when it gets falsy results', () => {
      expect(def(0)).toBe(0)
      expect(def('')).toBe('')
      expect(def(false)).toBe(false)
      expect(Number.isNaN(def(NaN))).toBe(true)
      expect(def([])).toEqual([])
      expect(def({})).toEqual({})
    })
  })

  describe('includes a spreadable function that', () => {
    it('should wrap a single value in an array', () => {
      expect(f.spreadable('a')).toEqual(['a'])
      expect(f.spreadable(6)).toEqual([6])
      expect(f.spreadable({foo: 'bar'})).toEqual([{foo: 'bar'}])
    })

    it('should pass through an array without changing it', () => {
      expect(f.spreadable([6])).toEqual([6])
      expect(f.spreadable([6, 4, 'foo'])).toEqual([6, 4, 'foo'])
    })

    it('should allow a function to spread a single value', () => {
      let id = (arg) => arg,
        spreadable4 = f.spreadable(4),
        spreadableFoo = f.spreadable({foo: 'bar'})

      expect(id(...spreadable4)).toBe(4)
      expect(id(...spreadableFoo)).toEqual({foo: 'bar'})
    })
  })

  describe('includes a map function that', () => {
    let inc = (x) => x + 1,
      incAll = f.map(inc)

    it('should build a generic function', () => {
      expect(typeof incAll).toBe('function')
    })

    it('should properly map taking data last', () => {
      let test = [1, 2, 3]

      expect(incAll(test)).toEqual([2, 3, 4])
    })

    it('should call a map method on types other than array', () => {
      let test = {},
        mock = jest.fn()

      test.map = mock

      f.map(inc)(test)

      expect(mock).toHaveBeenCalled()
    })
  })

  describe('includes a filter function that', () => {
    let isEven = (x) => x % 2 === 0,
      onlyEven = f.filter(isEven)

    it('should build a generic function', () => {
      expect(typeof onlyEven).toBe('function')
    })

    it('should properly filter taking data last', () => {
      expect(onlyEven([1, 2, 3])).toEqual([2])
      expect(onlyEven([-1, -6, 0, 3, 8, 2])).toEqual([-6, 0, 8, 2])
    })
  })

  describe('includes a reduce function that', () => {
    let sum = (x, y) => x + y,
      sumAll = f.reduce(sum),
      test = [1, 2, 3]

    it('should build a generic function', () => {
      expect(typeof sumAll).toBe('function')
      expect(typeof sumAll(0)).toBe('function')
    })

    it('should properly reduce taking data last', () => {
      expect(sumAll(0)(test)).toBe(6)
      expect(sumAll(10)(test)).toBe(16)
    })
  })
})

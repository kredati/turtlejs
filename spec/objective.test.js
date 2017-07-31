let o = require('../modules/objective'),
  f = require('../modules/functional')

describe('turtle.js object helper functions', () => {
  it('should export the correct API', () => {
    expect(typeof o.pair).toBe('function')
    expect(typeof o.add).toBe('function')
    expect(typeof o.map).toBe('function')
    expect(typeof o.mappable).toBe('function')
  })

  describe('include a pair function', () => {
    it('should return an object with the key/value pair for primitives', () => {
      expect(o.pair('foo', 'bar')).toEqual({foo: 'bar'})
      expect(o.pair('baz', 16)).toEqual({baz: 16})
    })

    it('should return an object with the key/value pair for objects', () => {
      expect(o.pair('foo', {bar: 'baz'})).toEqual({foo: {bar: 'baz'}})
    })

    it('should return an object with the key/value pair for functions', () => {
      let mock = jest.fn(),
        test = o.pair('foo', mock)

      expect(test.foo).not.toThrow()
      expect(mock).toHaveBeenCalled()
    })
  })

  describe('include an add function', () => {
    let foo = {foo: 'bar'}

    it('should add a key/value pair to an empty object', () => {
      expect(o.add({}, 'foo', 'bar')).toEqual(foo)
    })

    it('should add a key/value pair to an existing object', () => {
      let added = o.add(foo, 'bar', 'baz')

      expect(added).toEqual({foo: 'bar', bar: 'baz'})
    })

    it('should not modify the original object', () => {
      let added = o.add(foo, 'bar', 'baz')

      expect(added).not.toBe(foo)
    })
  })

  describe('include a map function', () => {
    it('should map numbers as values', () => {
      let nums = {foo: 1, bar: 2, baz: 3},
        inc = (x) => x + 1,
        asStr = (x) => `${x}`

      expect(o.map(inc)(nums)).toEqual({foo: 2, bar: 3, baz: 4})
      expect(o.map(asStr)(nums)).toEqual({foo: '1', bar: '2', baz: '3'})
    })

    it('should not modify the original object', () => {
      let nums = {foo: 1, bar: 2, baz: 3},
        inc = (x) => x + 1

      expect(o.map(inc)(nums)).not.toBe(nums)
    })

    it('should map strings as values', () => {
      let strs = {foo: 'bar', bar: 'baz'},
        exclaim = (str) => `${str}!`

      expect(o.map(exclaim)(strs)).toEqual({foo: 'bar!', bar: 'baz!'})
    })

    it('should map arrays as values', () => {
      let arrs = {foo: [1, 2, 3], bar: [2, 3, 4]},
        inc = (x) => x + 1,
        incAll = f.map(inc)

      expect(o.map(incAll)(arrs)).toEqual({foo: [2, 3, 4], bar: [3, 4, 5]})
    })

    it('should map functions as values', () => {
      let not = (bool) => !bool,
        fns = {tru: () => true, id: (arg) => arg}

      expect(fns.tru()).toBe(true)
      expect(fns.id(true)).toBe(true)
      expect(fns.id(false)).toBe(false)

      let oppo = o.map(f.after(not))(fns)

      expect(oppo.tru).not.toThrow()
      expect(oppo.tru()).toBe(false)
      expect(oppo.id(true)).toBe(false)
      expect(oppo.id(false)).toBe(true)
    })
  })

  describe('include a mappable function', () => {
    let obj = {foo: 'bar'},
      id = (arg) => arg,
      exclaim = (str) => `${str}!`

    it('should add a map method to an object', () => {
      let mappable = o.mappable(obj)

      expect(mappable.map).toBeDefined()
      expect(typeof mappable.map).toBe('function')
    })

    it('should not change the original object', () => {
      let mappable = o.mappable(obj)

      expect(mappable).not.toBe(obj)
    })

    it('should be callable directly', () => {
      let mappable = o.mappable(obj)

      expect(mappable.map(exclaim)).toEqual({foo: 'bar!'})
    })

    it('should be compatible with f.map', () => {
      let mappable = o.mappable(obj)

      expect(f.map(exclaim)(mappable)).toEqual({foo: 'bar!'})
    })
  })

  describe('include a filter function that', () => {
    it('should export a function', () => {
      expect(o.filter).toBeDefined()
      expect(typeof o.filter).toBe('function')
    })

    it('should filter properties on an object', () => {
      let obj = {foo: true, bar: false},
        id = (arg) => arg,
        tru = () => true

      expect(o.filter(tru)(obj)).toEqual(obj)
      expect(o.filter(id)(obj)).toEqual({foo: true})
    })

    it('should not alter the original object', () => {
      let obj = {foo: true, bar: false},
        id = (arg) => arg,
        tru = () => true

      expect(o.filter(tru)(obj)).not.toBe(obj)
      expect(o.filter(id)(obj)).not.toBe(obj)
      expect(obj).toEqual({foo: true, bar: false})
    })

    it('should filter keys that hold different kinds of values', () => {
      let baz = () => true,
        obj = {foo: 'bar', bar: 42, baz}

      expect(o.filter((value) => typeof value === 'function')(obj)).toEqual({baz})
      expect(o.filter(() => true)(obj)).toEqual(obj)
      expect(o.filter((value) => value > 40)(obj)).toEqual({bar: 42})
    })
  })
})

let e = require('../modules/exports')

describe('turtle.js exporter module', () => {
  it('should export the correct API', () => {
    expect(typeof e.exports).toBe('function')
    expect(typeof e.collect).toBe('function')
    expect(typeof e.fluent).toBe('function')
  })

  describe('includes a collect function that', () => {
    it('should collect all properties on an object of a given type', () => {
      let tru = () => true,
        obj = {foo: 'bar', bar: 42, baz: tru}

      expect(e.collect('string')(obj)).toEqual({foo: 'bar'})
      expect(e.collect('number')(obj)).toEqual({bar: 42})
      expect(e.collect('function')(obj)).toEqual({baz: tru})
      expect(e.collect('primitive')(obj)).toEqual({foo: 'bar', bar: 42})
      expect(e.collect('any')(obj)).toEqual(obj)
    })

    it('should not change the original object', () => {
      let tru = () => true,
        obj = {foo: 'bar', bar: 42, baz: tru},
        collected = e.collect('any')(obj)

      expect(collected).toEqual(obj)
      expect(collected).not.toBe(obj)
    })
  })

  describe('includes an exports function that', () => {
    it('should copy all non-primitive properties on an object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo}

      expect(e.exports(obj)).toEqual(obj)
    })

    it('should not copy primitive properites on an object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo, bar: 42}

      expect(() => e.exports(obj)).toThrow()
    })

    it('should not modify the original object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo}

      expect(e.exports(obj)).not.toBe(obj)
    })
  })

  describe('includes a fluent function that', () => {
    it('should copy all non primitive properites on an object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo}

      let fluent = e.fluent(obj)

      expect(fluent.foo).toBe(foo)
      expect(typeof fluent.id).toBe('function')
      expect(typeof fluent.tru).toBe('function')
      expect(() => fluent.tru()).not.toThrow()
      expect(() => fluent.id('foo')).not.toThrow()
    })

    it('should not copy primitive properties on an object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo, bar: 42}

      expect(() => e.fluent(obj)).toThrow()
    })

    it('should not modify the original object', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo}

      expect(e.fluent(obj)).not.toBe(obj)
    })

    it('should export non-returning functions to return the object', () => {
      let id = (arg) => arg,
        tru = () => true,
        empty = () => {},
        foo = {foo: 'bar'},
        obj = {id, tru, foo, empty},
        fluent = e.fluent(obj)

      expect(fluent.empty()).toBe(fluent)
    })

    it('should export returning functions to return their ouput', () => {
      let id = (arg) => arg,
        tru = () => true,
        foo = {foo: 'bar'},
        obj = {id, tru, foo},
        fluent = e.fluent(obj)

      expect(fluent.tru()).toEqual(obj.tru())
      expect(fluent.tru()).toBe(true)
      expect(fluent.id('foo')).toEqual(obj.id('foo'))
      expect(fluent.id('foo')).toBe('foo')
    })
  })
})

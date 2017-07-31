let is = require('../modules/is')

// is should test:
// number, object, string, function, boolean, undefined,
// array, null, primitive, any

describe('A helper module for handling types dynamically', () => {
  it('should see the module', () => {
    expect(is).toBeDefined()
  })

  it('should properly identify strings', () => {
    let string = 'I am a string'

    expect(is.string(string)).toBe(true)
    expect(is.function(string)).toBe(false)
    expect(is.number(string)).toBe(false)
    expect(is.object(string)).toBe(false)
    expect(is.boolean(string)).toBe(false)
    expect(is.undefined(string)).toBe(false)
    expect(is.array(string)).toBe(false)
    expect(is.null(string)).toBe(false)
    expect(is.any(string)).toBe(true)
  })

  it('should properly identify objects', () => {
    let obj = {}

    expect(is.string(obj)).toBe(false)
    expect(is.function(obj)).toBe(false)
    expect(is.number(obj)).toBe(false)
    expect(is.object(obj)).toBe(true)
    expect(is.boolean(obj)).toBe(false)
    expect(is.undefined(obj)).toBe(false)
    expect(is.array(obj)).toBe(false)
    expect(is.null(obj)).toBe(false)
    expect(is.any(obj)).toBe(true)
  })

  it('should properly identify numbers', () => {
    let num = 65.67,
      nan = NaN

    expect(is.string(num)).toBe(false)
    expect(is.function(num)).toBe(false)
    expect(is.number(num)).toBe(true)
    expect(is.number(nan)).toBe(false)
    expect(is.object(num)).toBe(false)
    expect(is.boolean(num)).toBe(false)
    expect(is.undefined(num)).toBe(false)
    expect(is.array(num)).toBe(false)
    expect(is.null(num)).toBe(false)
    expect(is.any(num)).toBe(true)
  })

  it('should properly identify booleans', () => {
    let bool = false

    expect(is.string(bool)).toBe(false)
    expect(is.function(bool)).toBe(false)
    expect(is.number(bool)).toBe(false)
    expect(is.object(bool)).toBe(false)
    expect(is.boolean(bool)).toBe(true)
    expect(is.undefined(bool)).toBe(false)
    expect(is.array(bool)).toBe(false)
    expect(is.null(bool)).toBe(false)
    expect(is.any(bool)).toBe(true)
  })

  it('should properly identify arrays', () => {
    let arr = []

    expect(is.string(arr)).toBe(false)
    expect(is.function(arr)).toBe(false)
    expect(is.number(arr)).toBe(false)
    expect(is.object(arr)).toBe(true)
    expect(is.boolean(arr)).toBe(false)
    expect(is.undefined(arr)).toBe(false)
    expect(is.array(arr)).toBe(true)
    expect(is.null(arr)).toBe(false)
    expect(is.any(arr)).toBe(true)
  })

  it('should properly identify undefined', () => {
    let undef

    expect(is.string(undef)).toBe(false)
    expect(is.function(undef)).toBe(false)
    expect(is.number(undef)).toBe(false)
    expect(is.object(undef)).toBe(false)
    expect(is.boolean(undef)).toBe(false)
    expect(is.undefined(undef)).toBe(true)
    expect(is.array(undef)).toBe(false)
    expect(is.null(undef)).toBe(false)
    expect(is.any(undef)).toBe(false)
  })

  it('should properly identify primitives', () => {
    let string = 'string',
      obj = {},
      func = () => true,
      bool = true,
      array = [],
      nil = null,
      num = 42,
      undef

    expect(is.primitive(string)).toBe(true)
    expect(is.primitive(num)).toBe(true)
    expect(is.primitive(bool)).toBe(true)
    expect(is.primitive(undef)).toBe(false)
    expect(is.primitive(func)).toBe(false)
    expect(is.primitive(obj)).toBe(false)
    expect(is.primitive(nil)).toBe(false)
    expect(is.primitive(undef)).toBe(false)
  })

  it('should properly identify any', () => {
    let string = 'string',
      obj = {},
      func = () => true,
      bool = true,
      array = [],
      nil = null,
      num = 42,
      undef

    expect(is.any(string)).toBe(true)
    expect(is.any(num)).toBe(true)
    expect(is.any(bool)).toBe(true)
    expect(is.any(undef)).toBe(false)
    expect(is.any(func)).toBe(true)
    expect(is.any(obj)).toBe(true)
    expect(is.any(nil)).toBe(false)
    expect(is.any(undef)).toBe(false)
  })

  it('should properly identify functions', () => {
    let func = () => true

    expect(is.string(func)).toBe(false)
    expect(is.function(func)).toBe(true)
    expect(is.number(func)).toBe(false)
    expect(is.object(func)).toBe(false)
    expect(is.boolean(func)).toBe(false)
    expect(is.undefined(func)).toBe(false)
    expect(is.array(func)).toBe(false)
    expect(is.null(func)).toBe(false)
    expect(is.any(func)).toBe(true)
  })
})

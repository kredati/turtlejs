const s = require('../modules/sign')

const sign = s.sign

describe('turtle.js real-time type checking system', () => {
  it('should build a function when given a function', () => {
    let signed = sign(() => true, [])

    expect(typeof signed).toBe('function')
  })

  it('should sign a function and let it run correctly with no args', () => {
    let tru = () => true,
      signed = sign(tru, [])

    expect(() => signed()).not.toThrow()
    expect(signed()).toBe(true)
  })

  it('should sign a function with no args and warn with passed args', () => {
    let tru = () => true,
      signed = sign(tru, []),
      mockWarn = jest.fn()

    console.warn = mockWarn

    signed('foo')

    expect(mockWarn).toHaveBeenCalled()
  })

  it('should sign a function with one argument of any type', () => {
    let id = (arg) => arg,
      signedId = sign(id, ['any']),
      mockWarn = jest.fn()

    console.warn = mockWarn

    expect(signedId('foo')).toBe('foo')
    expect(() => signedId()).toThrow()
    signedId('foo', 'bar')
    expect(mockWarn).toHaveBeenCalled()
  })

  it('should sign a function with one argument of a particular type', () => {
    let id = (arg) => arg,
      stringId = sign(id, ['string'])

    expect(stringId('foo')).toBe('foo')
    expect(() => stringId(6)).toThrow()
    expect(() => stringId(['foo'])).toThrow()
  })

  it('should not sign with an invalid signature', () => {
    let id = (arg) => arg

    expect(() => sign(id, 'foo')).toThrow()
    expect(() => sign(id, ['foo'])).toThrow()
  })

  it('should sign a function with more than one argument', () => {
    let group = (first, second, third) => [first, second, third],
      sig = ['string', 'number', 'function'],
      mock = jest.fn()

    console.warn = mock

    expect(() => sign(group, sig)).not.toThrow()

    let signed = sign(group, sig)

    expect(() => signed('foo', 42, () => true)).not.toThrow()
    expect(() => signed('foo', 'forty-two', () => true)).toThrow()
    expect(() => signed('foo', 42)).toThrow()

    signed('foo', 42, () => true, [])
    expect(mock).toHaveBeenCalled()
  })

  it('should retrieve the signature of a function', () => {
    let id = (arg) => arg,
      signed = sign(id, ['any'])

    expect(s.getSignature(id)).toEqual(['any'])
    expect(s.getSignature(signed)).toEqual(['any'])
  })

  it('should throw an error attempting to access a non-existent signature', () => {
    let id = (arg) => arg

    expect(() => s.getSignature(id)).toThrow()
  })

  it('should mark the signed function as signed', () => {
    let id = (arg) => arg,
      signed = sign(id, ['any'])

    expect(signed.signed).toBe(true)
    expect(id.signed).toBeUndefined()
  })
})

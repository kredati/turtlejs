module.exports = (() => {
  const is = require('./is')

  const map = (fn) => (mappable) => mappable.map(fn)

  const reduce = (fn) => (init) => (reducible) => reducible.reduce(fn, init)

  const filter = (fn) => (filterable) => filterable.filter(fn)

  const maybe = (certain) => (possible) => is.any(possible) ? possible : certain

  const spreadable = (value) => is.array(value) ? value : [value]

  const pipe = (...fns) => (arg) => fns.reduce((res, fn) => fn(res), arg)

  const compose = (...fns) => (arg) => fns.reduceRight((res, fn) => fn(res), arg)

  const before = (decorator) => (main) => (...args) =>
    main(...spreadable(maybe(args)(decorator(...args))))

  const after = (decorator) => (main) => (...args) =>
    decorator(...spreadable(maybe(args)(main(...args))))

  const fluent = (chainable) => (fn) => (...args) => maybe(chainable)(fn(...args))

  return {
    compose,
    pipe,
    before,
    after,
    fluent,
    spreadable,
    maybe,
    map,
    reduce,
    filter
  }
})()

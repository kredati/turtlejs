module.exports = (() => {
  const o = require('./objective'),
    is = require('./is'),
    f = require('./functional')

  const collect = (type) => (obj) => o.filter(is[type])(obj)

  const exports = (obj) => {
    let myMethods = collect('function')(obj),
      myObjects = collect('object')(obj),
      myPrimitives = collect('primitive')(obj)

    if (o.keys(myPrimitives).length > 0)
      throw Error(`Cannot export primitives: strings, numbers, and booleans.
        Wrap primitives in objects or use getter/setter methods.`)

    return Object.assign({}, myMethods, myObjects)
  }

  const fluent = (obj) => {
    let chainable = {},
      exported = exports(obj),
      fns = collect('function')(exported),
      fluentified = o.map((fn) => f.fluent(chainable)(fn))(fns)

    return Object.assign(chainable, exported, fluentified)
  }

  return {collect, exports, fluent}
})()

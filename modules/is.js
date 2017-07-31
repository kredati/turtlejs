module.exports = (() => {
  let is = {}

  is.function = (prop) => typeof prop === 'function'

  is.object = (prop) => typeof prop === 'object'

  is.string = (prop) => typeof prop === 'string'

  is.number = (prop) => typeof prop === 'number' && !Number.isNaN(prop)

  is.boolean = (prop) => typeof prop === 'boolean'

  is.undefined = (prop) => typeof prop === 'undefined'

  is.array = (prop) => Array.isArray(prop)

  is.null = (prop) => prop === null

  is.primitive = (prop) =>
    is.any(prop) ? !(is.function(prop) || is.object(prop)) : false

  is.any = (prop) => !is.undefined(prop) && !is.null(prop)

  return is
})()

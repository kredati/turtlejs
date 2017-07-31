module.exports = (() => {
  let f = require('./functional')

  const keys = Object.keys

  const values = Object.values

  const pair = (key, value) =>
    Object.defineProperty({}, key, {
      value,
      enumerable: true
    })

  const add = (obj, key, value) => Object.assign({}, obj, pair(key, value))

  const map = (fn) => (obj) =>
    f.reduce((acc, key) => {
      let value = obj[key],
        mapped = fn(value)

      return add(acc, key, mapped)
    })({})(keys(obj))

  const mapMethod = (obj) => (fn) => map(fn)(obj)

  const mappable = (obj) => add(obj, 'map', mapMethod(obj))

  const filter = (fn) => (obj) =>
    f.reduce((acc, key) => {
      let value = obj[key]

      return fn(value) ? add(acc, key, value) : acc
    })({})(keys(obj))

  return {
    keys,
    values,
    pair,
    add,
    map,
    mappable,
    filter
  }
})()

module.exports = (() => {
  let is = require('./is'),
    fn = require('./functional'),
    obj = require('./objective'),
    sign = require('./sign'),
    exports = require('./exports')

  return {
    fn,
    obj,
    is,
    sign,
    exports
  }
})()

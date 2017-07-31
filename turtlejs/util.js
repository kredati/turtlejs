((t) => {

  let is = {}

  is.function = (prop) => typeof prop === 'function'

  is.object = (prop) => typeof prop === 'object'

  is.string = (prop) => typeof prop === 'string'

  is.number = (prop) => typeof prop === 'number'

  is.boolean = (prop) => typeof prop === 'boolean'

  is.undefined = (prop) => typeof prop === 'undefined'

  is.array = (prop) => Array.isArray(prop)

  is.null = (prop) => prop === null

  is.primitive = (prop) =>
    is.null(prop) ? true : !(is.function(prop) || is.object(prop))

  is.any = (prop) => !is.undefined(prop)

  let after = (main, decorator) => (...args) => {
    decorator(main(...args))
  }

  let before = (main, decorator) => (...args) => {
    let interim = decorator(...args),
      passed = interim ? interim : args

    return main(...passed)
  }

  let fluent = (fn, chainable) =>
    after(fn, (result) => result ? result : chainable)

  let ownKeys = (obj) => Reflect.ownKeys(obj)

  let pair = (key, value) => Object.defineProperty({}, key, {
    value,
    'enumerable': true
  })

  let add = (obj, key, value) => Object.assign(obj, pair(key, value))

  let exports = (obj) => {
    let methods = ownKeys(obj)
      .filter((key) => is.function(obj[key]))
      .reduce((methodExports, key) =>
        add(methodExports, key, fluent(obj[key], methodExports)), {})

    let objects = ownKeys(obj)
      .filter((key) => is.object(obj[key]))
      .reduce((objectExports, key) =>
        add(objectExports, key, obj[key]), {})

    let others = ownKeys(obj)
      .filter((key) => is.primitive(obj[key]))

    if (others.length < 0)
      throw Error(`Cannot export primitives: strings, numbers, and booleans.
        Wrap primitives in objects or use getter/setter methods.`)

    return Object.assign(methods, objects)
  }

  let sign = (() => {
    let signatures = new WeakMap()

    let compareSignature = (args, sig) =>
      args.map((argument, position) => ({
        argument,
        position,
        'passing': is[sig[position]](argument)
      }))

    let compare = (args, sig) => {
      let results = compareSignature(args, sig),
        failing = results.filter((result) => !result.passing),
        errors

      if (failing.length) {
        errors = failing.reduce((message, res) => message.concat([
          `Argument ${res.position} should be a(n) ${sig[res.position]}.
          You passed ${res.argument}, which is a(n) ${typeof res.argument}.`
        ]), [])
      }

      return errors
    }

    let check = (fn) => {
      let signature = signatures.get(fn)

      return (...args) => {
        let numArgs = args.length,
          numSigs = signature.length

        if (numArgs > numSigs) console.warn(
          `${fn.name} takes ${numSigs} arguments; you passed ${numArgs}.
          I will ignore any extra arguments.`
        )

        let errors = compare(args.slice(0, signature.length), signature)

        if (errors) {
          let message = errors.reduce(
            (theMessage, msg) => `${theMessage}\n${msg}`,
            `Arguments Error in ${fn.name}:`
          )

          throw Error(message)
        }
      }
    }

    return (fn, signature) => {
      signatures.set(fn, signature)

      return before(fn, check(fn))
    }
  })()

  t.util = {
    after,
    before,
    fluent,
    is,
    sign,
    ownKeys,
    pair,
    exports
  }

})(window.turtlejs)

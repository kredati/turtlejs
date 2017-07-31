module.exports = (() => {
  const f = require('./functional'),
    o = require('./objective'),
    is = require('./is')

  const signatures = new WeakMap()

  const compareSignature = (args, sig) =>
    args.map((argument, position) => ({
      argument,
      position,
      passing: is[sig[position]](argument)
    }))

  const compare = (args, sig) => {
    let results = compareSignature(args, sig),
      failing = results.filter((result) => !result.passing),
      errors

    if (failing.length) {
      errors = failing.reduce(
        (message, res) =>
          message.concat([
            `Argument ${res.position} should be a(n) ${sig[res.position]}.` +
              `You passed ${res.argument}, which is a(n) ${typeof res.argument}.`
          ]),
        []
      )
    }

    return errors
  }

  const check = (fn) => {
    const signature = signatures.get(fn)

    return (...args) => {
      let numArgs = args.length,
        numSigs = signature.length

      if (numArgs > numSigs)
        console.warn(
          `${fn.name} takes ${numSigs} arguments: ${signature}. ` +
            `You passed ${numArgs}: ${args.map((arg) => typeof arg)}. ` +
            `I will ignore any extra arguments.`
        )

      if (numSigs > numArgs)
        throw Error(
          `${fn.name} takes ${numSigs} arguments: ${signature}. ` +
            `You passed ${numArgs}: ${args.map((arg) => typeof arg)}.`
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

  const validateSignature = (signature) => {
    if (!is.array(signature))
      throw Error(`Type signature must be an array of strings.`)

    if (signature.filter(is.string).length !== signature.length)
      throw Error(`Type signature must be an array of strings.`)

    let invalid = signature.filter((type) => !o.keys(is).includes(type))

    if (invalid.length > 0)
      throw Error(`I cannot sign with the following types: ${invalid}`)

    return signature
  }

  const sign = (fn, signature) => {
    let validated = validateSignature(signature)

    signatures.set(fn, validated)

    let signed = f.before(check(fn))(fn)

    signed.signed = true

    signatures.set(signed, validated)

    return signed
  }

  const getSignature = (fn) => {
    let signature = signatures.get(fn)

    if (is.array(signature)) return signature

    throw Error(`No signature available for ${fn}.`)
  }

  return {sign, getSignature}
})()

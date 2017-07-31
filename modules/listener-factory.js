module.exports = (() => {

  let {TurtleCommand} = require('./turtleCommand')

  let composeInstance = (proto, ...opts) =>
    Object.assign(Object.create(proto), ...opts)

  let validCode = (key) => {
    if (typeof key === 'string') {
      if (key.length > 1)
        throw Error('I can only listen to one key at a time.')

      return key.charCodeAt(0)
    }

    else if (typeof key === 'number') return key

    throw Error('I can only listen to valid keys.')
  }

  let Listener = {
    listen () {
      if (keyCode === this.code) this.fn()
    }
  }

  let createListener = (key, fn, context) => {
    let code = validCode(key),
      bound = context
        ? fn.bind(context)
        : fn

    let props = {code, fn: bound}

    return composeInstance(Listener, props)
  }

  let listeningKeys = [],
    listeners = {}

  let listen = () => {
    if (keyIsPressed)
      listeningKeys.forEach((key) => listeners[key].listen())
  }

  let listeningOn = (key) => {
    listeningKeys.includes(key)
  }

  let listenOn = (key, command) => {
    let listensToCommand = command instanceof TurtleCommand

    if (!listensToCommand) throw Error('I can only learn commands!')

    command.stop()

    let fn = () => command.go()

    if (!listeningOn(key)) listeningKeys.push(key)

    listeners[key] = createListener(key, fn)
  }

  let reset = () => {
    listeningKeys = [],
      listeners = {}
  }

  let listener = {listen}

  return {
    listen: listenOn,
    resetListeners: reset,
    listener
  }

})()

(turtlejs => {

class Listener {

  constructor(key, fn, context) {
    if (typeof key === 'string') {
      if (key.length > 1)
        throw new Error('I can only listen to one key at a time.')
      this.code = key.charCodeAt(0)
    }
    else if (typeof key === 'number')
      this.code = key
    else throw new Error('I can only listen to valid keys.')

    this.fn = fn.bind(context)
  }

  listen() {
    if (keyCode === this.code) this.fn()
  }

}

let listeningKeys = [],
  listeners = {}

let listen = () => {
  if (keyIsPressed)
    listeningKeys.forEach(key => listeners[key].listen())
}

let listeningOn = key => {
  listeningKeys.includes(key)
}

let listenOn = (key, fn, context) => {
  if (!listeningOn(key)) listeningKeys.push(key)

  listeners[key] = new Listener(key, fn, context)
}

let reset = () => {
  listeningKeys = [],
    listeners = {}
}

turtlejs.listener = {
  Listener,
  listen,
  reset
}

turtlejs.listen = listenOn
turtlejs.resetListeners = reset

})(window.turtlejs)

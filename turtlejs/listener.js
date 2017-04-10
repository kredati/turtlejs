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

let listeners = []

let listen = () => {
  if (keyIsPressed)
    listeners.forEach(listener => listener.listen())
}

let listenOn = (key, fn, context) => {
  listeners.push(new Listener(key, fn, context))
}

turtlejs.listener = {
  Listener,
  listen
}

turtlejs.listen = listenOn

})(turtlejs)

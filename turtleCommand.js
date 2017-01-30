class TurtleCommandCenter {

  constructor (turtle) {
    this.turtle = turtle
    this.stack = []

    this.exportGlobals()
  }

  executeStack () {
    this.stack.forEach(chain => {
      chain.forEach(command => { command.execute() })
    })

    this.stack = []
  }

  registerChain (commandChain) {
    if (!this.stack.includes(commandChain)) this.stack.push(commandChain)
  }

  replaceChain (oldChain, newChain) {
    if (!this.stack.includes(oldChain))
      throw new Error('I cannot replace a chain I do not have.')

    let chainAt = this.stack.indexOf(oldChain)

    this.stack[chainAt] = newChain
  }

  exportGlobals () {
    let turtle = this.turtle

    for (let method in turtle.methods)
      if ({}.hasOwnProperty.call(turtle.methods, method)) {
        window[method] = argument =>
          new TurtleCommand(this, [])[method](argument)
      }

    window.repeat = (times, commands) =>
      new TurtleCommand(this, []).repeat(times, commands)
  }

}

class TurtleCommand {

  constructor (commandCenter, commandChain = []) {
    this.turtle = commandCenter.turtle
    this.turtleMethods = this.turtle.exportMethods({})

    this.methods = {}
    for (let method in this.turtleMethods) {
      if ({}.hasOwnProperty.call(this.turtleMethods, method))
        this[method] = this.buildMethod(method)
    }

    this.commandCenter = commandCenter
    this.commandChain = commandChain
    this.commandCenter.registerChain(this.commandChain)
  }

  buildMethod (command) {
    return argument => {
      this.toExecute = () => this.turtleMethods[command](argument)
      this.commandChain.push(this)

      return new TurtleCommand(this.commandCenter, this.commandChain)
    }
  }

  execute () {
    this.toExecute()

    return this
  }

  repeat (times, toDo) {
    if (toDo instanceof Function) this.repeatFunction(times, toDo)

    else if (toDo instanceof TurtleCommand) this.repeatCommands(times, toDo)

    else throw new Error('I can only repeat commands or functions.')

    this.commandChain.push(this)

    return new TurtleCommand(this.commandCenter, [])
  }

  repeatCommands (times, command) {
    let repeater = [],
      commandChain = command.commandChain

    for (let i = 0; i < times; ++i) repeater = repeater.concat(commandChain)

    this.toExecute = () => repeater.forEach(line => line.execute())
  }

  repeatFunction(times, toDo) {
    this.toExecute = () => {
      console.log(`Executing repeat of ${toDo}, ${times} times.`)

      let localCommandCenter = new TurtleCommandCenter(this.turtle)

      for (let i = 0; i < times; ++i) toDo()

      localCommandCenter.executeStack()

      this.commandCenter.exportGlobals()
    }
  }

}

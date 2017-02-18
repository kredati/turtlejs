class TurtleCommandCenter {

  constructor (turtle = new Turtle(width/2, height/2)) {
    this.turtle = turtle

    this.stack = []

    this.exportGlobals()
  }

  executeStack (parent) {
    if (this.stack.length) {
      console.log('Command received! Thank you for letting me work on this.')

      this.stack.forEach(chain => {
        chain.forEach(command => { command.execute() })
      })

      this.turtle.render()

      this.stack = []

      console.log('I\'m done! Ready for your next instruction.')
    }
  }

  registerChain (commandChain) {
    if (!this.stack.includes(commandChain)) this.stack.push(commandChain)
  }

  deregisterChain(commandChain) {
    let chainIndex = this.stack.indexOf(commandChain)

    if (chainIndex < 0)
      throw new Error('I cannot deregister something I don\'t know about.')

    this.stack[chainIndex] = []
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

class TurtleSubcommandCenter extends TurtleCommandCenter {

  constructor(...args) {
    super(args)
  }

  executeStack (parent) {
    this.stack.forEach(chain => {
      chain.forEach(command => { command.execute() })
    })
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
    if (this.toExecute()) undoStack.push(this)

    return this
  }

  repeat (times, commands) {

    if (commands instanceof TurtleCommand) this.repeatCommands(times, commands)

    else throw new Error(
      `I can only repeat commands. You gave me a(n) ${typeof toDo}.`
    )

    this.commandChain.push(this)

    return new TurtleCommand(this.commandCenter, this.commandChain)
  }

  repeatCommands (times, command) {
    let repeater = [],
      commandChain = command.commandChain

    times.times(() => { repeater = repeater.concat(commandChain) })

    this.commandCenter.deregisterChain(commandChain)

    this.toExecute = () => {
      let localCommandCenter = new TurtleSubcommandCenter(this.turtle)

      localCommandCenter.registerChain(repeater)
      localCommandCenter.executeStack()

      this.commandCenter.exportGlobals()
    }
  }

}

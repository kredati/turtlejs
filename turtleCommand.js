class TurtleCommandCenter {

  constructor (turtle = new Turtle(width/2, height/2)) {
    this.turtle = turtle

    this.stack = []
    this.undoStack = []
    this.redoStack = []

    this.exportGlobals()

    TurtleCommandCenter.ready()
  }

  executeStack (parent) {
    if (this.stack.length) {
      console.log('Command received! Thank you for letting me work on this.')

      this.stack.forEach(chain => {
        chain.forEach(command => { command.execute() })
      })

      this.turtle.render()

      this.stack = []
      this.redoStack = []

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

    window.undo = this.undo.bind(this)
    window.redo = this.redo.bind(this)

    window.reset = () => {
      this.turtle.reset()
      this.turtle.render()

      this.reset()

      console.clear()
      TurtleCommandCenter.ready()
    }

  }

  undo (steps = 1) {
    let stackLength = this.undoStack.length,
      stack = this.undoStack.slice(0, stackLength - steps)

    let undone = this.undoStack.slice(stackLength - steps, stackLength)

    this.redoStack = undone.concat(this.redoStack)
    this.undoStack = stack

    this.turtle.erase()
    this.turtle.home()
    this.undoStack.forEach(command => command.toExecute())
    this.turtle.render()
  }

  redo (steps = 1) {
    let stepsToRedo = steps > this.redoStack.length
      ? this.redoStack.length
      : steps

    let stack = this.redoStack.slice(0, steps)

    this.redoStack = this.redoStack.slice(steps, length)

    stack.forEach(command => command.toExecute())

    this.undoStack = this.undoStack.concat(stack)
    this.turtle.render()
  }

  reset () {
    this.undoStack = []
    this.redoStack = []
  }

  static ready() {
    console.log('Turtle ready!')
  }

}

class TurtleSubcommandCenter extends TurtleCommandCenter {

  constructor(...args) {
    super(args)
    this.undoStack = args.last()
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
    if (this.toExecute()) this.commandCenter.undoStack.push(this)

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

(turtlejs => {

class TurtleCommandCenter {

  constructor (turtle = new turtlejs.Turtle(width/2, height/2)) {
    this.turtle = turtle

    this.stack = []
    this.undoStack = []
    this.redoStack = []

    this.learned = {}
  }

  executeStack () {
    if (this.stack.length) {

      this.stack.forEach(chain => {
        chain.forEach(command => { command.execute() })
      })

      this.stack = []
      this.redoStack = []

      this.turtle.render()

      console.log('Turtle ready!')
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

  reset () {
    this.resetStacks()

    this.turtle.reset().render()

    console.clear()
    console.log('Reset and ready!')
  }

  undo (steps = 1) {
    let stackLength = this.undoStack.length,
      stack = this.undoStack.slice(0, stackLength - steps)

    let undone = this.undoStack.slice(stackLength - steps, stackLength)

    this.redoStack = undone.concat(this.redoStack)
    this.undoStack = stack

    this.turtle.erase().home()
    this.undoStack.forEach(command => command.toExecute())
    this.turtle.render()
  }

  redo (steps = 1) {
    let stackLength = this.redoStack.length,
      stepsToRedo = steps > stackLength
        ? stackLength
        : steps

    let stack = this.redoStack.slice(0, steps)

    this.redoStack = this.redoStack.slice(steps, stackLength)

    stack.forEach(command => command.toExecute())

    this.undoStack = this.undoStack.concat(stack)
    this.turtle.render()
  }

  resetStacks () {
    this.undoStack = []
    this.redoStack = []
  }

  learn (name, command) {
    let getsCommand = command instanceof TurtleCommand

    if (!getsCommand)
      throw new Error(`I can only learn commands.`)

    command.stop()

    if (typeof name !== 'string')
      throw new Error(
        `Names of commands must be strings. You gave me a(n) ${typeof name}.`
      )

    if (turtlejs.language.conflicts(name))
      throw new Error(
        `The word "${name}" is reserved for system calls; try another name.`
      )

    let learned = () => command.go()

    turtlejs.language.setGlobal(name, learned)
  }

}

class TurtleSubcommandCenter extends TurtleCommandCenter {

  constructor(...args) {
    super(...args)
    this.undoStack = args.last()

    this.relinquishGlobals = turtlejs.language.borrowGlobalContext(this)
  }

  executeStack (parent) {
    this.stack.forEach(chain => {
      chain.forEach(command => { command.execute() })
    })

    this.relinquishGlobals()
  }

}

class TurtleCommand {

  constructor (commandCenter, commandChain = []) {
    this.turtle = commandCenter.turtle

    this.turtleMethods = turtlejs.language.getTurtleMethods(commandCenter)

    for (let method in this.turtleMethods) {
      if ({}.hasOwnProperty.call(this.turtleMethods, method))
        this[method] = this.buildMethod(method)
    }

    for (let command in commandCenter.learned) {
      if ({}.hasOwnProperty.call(commandCenter.learned, command))
        this[command] = turtlejs.language.getGlobal(command)
    }

    this.commandCenter = commandCenter
    this.commandChain = commandChain

    this.go()
  }

  buildMethod (command) {
    return argument => {
      this.toExecute = () => this.turtleMethods[command](argument)
      this.commandChain.push(this)
      this._info = {command, argument}

      return new TurtleCommand(this.commandCenter, this.commandChain)
    }
  }

  execute () {
    if (this.toExecute()) this.commandCenter.undoStack.push(this)

    return this
  }

  repeat (times, command) {

    if (command instanceof TurtleCommand) this.repeatCommand(times, command)

    else throw new Error(
      `I can only repeat commands. You gave me a(n) ${typeof command}.`
    )

    this.commandChain.push(this)

    this._info = {'command': 'repeat', times, 'repeating': command}

    return new TurtleCommand(this.commandCenter, this.commandChain)
  }

  repeatCommand (times, command) {
    let repeater = [],
      commandChain = command.commandChain

    times.times(() => { repeater = repeater.concat(commandChain) })

    command.stop()

    this.toExecute = () => {
      let localCommandCenter = new TurtleSubcommandCenter(this.turtle)

      localCommandCenter.registerChain(repeater)
      localCommandCenter.executeStack()
    }
  }

  stop () {
    this.commandCenter.deregisterChain(this.commandChain)

    return this
  }

  go () {
    this.commandCenter.registerChain(this.commandChain)

    return this
  }

}

Object.assign(turtlejs,
  {TurtleCommandCenter, TurtleSubcommandCenter, TurtleCommand}
)

})(window.turtlejs)

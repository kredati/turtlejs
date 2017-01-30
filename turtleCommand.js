class TurtleCommand {

  constructor (turtle, commands = []) {
    this.turtle = turtle
    this.turtleMethods = turtle.exportMethods({})

    this.commands = {}
    for (let method in this.turtleMethods) {
      if ({}.hasOwnProperty.call(this.turtleMethods, method))
        this[method] = this.buildCommand(method)
    }

    this.commands = commands
  }

  buildCommand (command) {
    return argument => {
      this.toExecute = () => this.turtleMethods[command](argument)
      this.commands.push(this)

      return new TurtleCommand(this.turtle, this.commands)
    }
  }

  execute () {
    this.commands.forEach(command => command.toExecute())

    return this.turtle
  }

  static exportGlobals (turtle, commandStack) {
    for (let method in turtle.methods)
      if ({}.hasOwnProperty.call(turtle.methods, method)) {
        window[method] = argument =>
          new TurtleCommand(turtle, commandStack)[method](argument)
      }

    window.repeat = TurtleCommand.repeat
  }

  static repeat (times, toDo) {
    if (toDo instanceof Function)
      return TurtleCommand.repeatFunction(times, toDo)

    if (toDo instanceof TurtleCommand)
      return TurtleCommand.repeatCommands(times, toDo)

    throw new Error('I can only repeat commands or functions.')
  }

  static repeatCommands (times, commands) {
    for (let i = 1; i < times; ++i) {
      commands.execute()
    }
  }

  static repeatFunction(times, toDo) {
    for (let i = 0; i < times; ++i) {
      toDo()
    }
  }

}

var language = {

  'commandMethods': [
    'undo',
    'redo',
    'learn',
    'reset'
  ],

  'turtleMethods': [
    'forward',
    'back',
    'left',
    'right',
    'turn',
    'jump',
    'home',
    'erase',
    'report',
    'repeat'
  ],

  composeGlobalContext (commandCenter) {
    window.commandCenter = commandCenter
    this.exportCenterCommands(commandCenter)
    this.exportTurtleCommands(commandCenter)
  },

  exportCenterCommands (commandCenter) {
    this.commandMethods.forEach(method => {
      window[method] = commandCenter[method].bind(commandCenter)
    })
  },

  exportTurtleCommands (commandCenter) {
    this.turtleMethods.forEach(method => {
      window[method] = (...args) =>
        new TurtleCommand(commandCenter, [])[method](...args)
    })
  },

  getTurtleMethods (commandCenter) {
    let methods = {},
      turtle = commandCenter.turtle

    this.turtleMethods.forEach(method => {
      if (turtle[method])
        methods[method] = turtle[method].bind(turtle)
    })

    return methods
  },

  exportRepeat(commandCenter) {
    window.repeat = (times, commands) =>
      new TurtleCommand(commandCenter, []).repeat(times, commands)
  },

  borrowGlobalContext (subcommandCtx) {
    this.exportTurtleCommands(subcommandCtx)

    return () => {
      this.exportTurtleCommands(window.commandCenter)
    }
  }

}

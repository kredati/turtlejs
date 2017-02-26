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
    'repeat',
    'pathColor'
  ],

  'learnedCommands': [],

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

  borrowGlobalContext (subcommandCtx) {
    this.exportTurtleCommands(subcommandCtx)

    return () => {
      this.exportTurtleCommands(window.commandCenter)
    }
  },

  getGlobal (name) {
    return window[name]
  },

  setGlobal (name, fn) {
    if (this.conflicts(name))
      throw new Error(
        `The word ${name} is reserved for system function calls.`
      )

    this.learnedCommands.push({name, fn})
    window[name] = fn
  },

  conflicts (name) {
    return !!window[name] && !this.isLearned(name)
  },

  isLearned (name) {
    return this.learnedCommands.map(command => command.name).includes(name)
  }

}

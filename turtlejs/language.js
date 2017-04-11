((global, turtlejs) => {

turtlejs.language = {

  'turtlejsMethods': [
    'load',
    'listen',
    'resetListeners'
  ],

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
    global.commandCenter = commandCenter
    this.exportCenterCommands(commandCenter)
    this.exportTurtleCommands(commandCenter)
    this.exportTurtlejsMethods()
  },

  exportCenterCommands (commandCenter) {
    this.commandMethods.forEach(method => {
      global[method] = commandCenter[method].bind(commandCenter)
    })
  },

  exportTurtleCommands (commandCenter) {
    this.turtleMethods.forEach(method => {
      global[method] = (...args) =>
        new turtlejs.TurtleCommand(commandCenter, [])[method](...args)
    })
  },

  exportTurtlejsMethods () {
    this.turtlejsMethods.forEach(method => {
      global[method] = turtlejs[method]
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
      this.exportTurtleCommands(global.commandCenter)
    }
  },

  getGlobal (name) {
    return global[name]
  },

  setGlobal (name, fn) {
    if (this.conflicts(name))
      throw new Error(
        `The word "${name}" is reserved for system function calls.`
      )

    if (!this.isLearned(name)) this.learnedCommands.push(name)

    global[name] = fn
  },

  conflicts (name) {
    return Boolean(global[name]) && !this.isLearned(name)
  },

  isLearned (name) {
    return this.learnedCommands.includes(name)
  }

} })(window, window.turtlejs)

// SMUGGLER CONFIG

/* global smuggler */
smuggler.config = {

  scriptPath: './',

  // List scripts in loading order
  scripts: [
    'library/p5.min.js',
    'library/helpers.js',
    // remove this once module conversion is complete
    'turtlejs/context.js'
  ],

  modulePath: './modules/',

  // List modules in loading order
  modules: [
    'util',
    'triangle-factory',
    'path-closure',
    'hud-closure',
    'turtle',
    'turtleCommand',
    'listener-factory',
    'language'
  ]
}

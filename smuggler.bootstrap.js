// SMUGGLER: gives you unauthorized `exports`

// Allows for CommonJS/node.js-style `module.exports` and `require`,
// in-browser, without prepackaging, bundling, etc.

// Oh my, you should be using Webpack or Browserify or even RequireJS.
// This is for an unusual use case (an un-use case?).

// Modules must be specified, in loading order, in smuggler.config.js
// or whatever config file you pass

/* eslint new-cap: "off" */

/////////// Basic error checking: don't load in node
if (typeof require !== `undefined`)
  throw Error(`require is already defined. ` +
    `Is there a conflict with another module loading system?`)

if (typeof module !== `undefined`)
  throw Error(`module already exists. ` +
    `Is there is a conflict with another module loading system?`)

'use strict';

((global) => {
  // construct a global module.exports object
  let module = {}

  module.exports = null
  module.loading = null

  global.module = module

  // get our main script, to run at the end
  let smugglerScript = document.currentScript,
    main = `./${smugglerScript.getAttribute('main')}`,
    configScript = smugglerScript.getAttribute('config')

  // default value for config location
  if (configScript) configScript = `./${configScript}`
  if (!configScript) configScript = `./smuggler.config.js`

  /////////////// HELPFUL/VERBOSE ERROR MESSAGES
  let errors = {
    LOAD_CONFIG: (path) => `Could not load config file at ${path}. ` +
      `Check to make sure there is a properly-formed ` +
      `Smuggler config file at ${path}. ` +
      `Consult the Smuggler docs for config file specs`,
    LOAD_SCRIPTS: () => `Could not load scripts`,
    LOAD_MODULES: () => `Could not load modules`,
    LOAD_MAIN: (path) => `Could not load main script at ${path}. ` +
      `Double check that the main attribute in the Smuggler bootstrap ` +
      `<script> tag is pointing at the correct file`,
    REQUIRE_MODULE: (path) => `Tried to require module at ${path} ` +
      `that has not been loaded. Check that there is a module at ${path}, ` +
      `for circular dependencies, and for proper module loading ` +
      `order in Smuggler config file`,
    LOAD_FILE: (path) => `Could not load file at ${path}`,
    NO_EXPORT: (path, exporting) => `${path} failed to export to ` +
      `${exporting}. This could be because there is an error in the file ` +
      `or because it does not bind anything to its export object ` +
      `(module.exports for a module, smuggler.config for a config file). ` +
      `Check to make sure you are not loading a script as a module, ` +
      `that you include a return statement in a module's IIFE, ` +
      `or that the config file binds properly to smuggler.config`,
    LOADING_INCOMPLETE: (path) => `File at ${path} did not complete loading. ` +
      `There may be an error in the file`,
    OUT_OF_SCOPE: () => `Cannot load files above app root. Check ` +
      `your paths in require calls`,
    MODULE_NOT_FOUND: (path) => `Could not find module at ${path}`,
    BAD_PATH: () => `The specified path is invalid. It must start with ` +
      `either './' or '../', and sepcify a path relative to the module ` +
      `from which it is required`,
    INVALID_PATH: (path, relative) => `Could not load module at ${path} ` +
      `relative to ${relative} because the path is invalid`,
    REQUIRE_STRING: (path) => `Paths passed to require must be strings. ` +
      `${path} is a(n) ${typeof path}`
  }

  let buildErrorMsg = (errorMsg, e) =>
    e ? `${errorMsg}.\n\nEncountered:\n${e}`
    : errorMsg

  // private state: config and modules
  let modules = {},
    config = {}

  // super handy helper functions
  let pair = (key, value) => ({[key]: value}),
    ref = (prop) => {
      let result = prop

      return result
    }

  ////////////// A HELPFUL FILENAME PARSER
  let withJS = (path) => path.endsWith(".js")
    ? path
    : path.concat(".js")

  ////////////// CORE LOADING FUNCTIONS
  // load a script! // returns a promise for async/await goodness
  // note that exporting is a *function* that lazy-evaluates the object
  // to which the module binds, if a module
  let onLoad = (resolve, reject) => (exporting) => (path) => () => {
    let exports = exporting()

    if (!exports) reject(
      Error(buildErrorMsg(errors.NO_EXPORT(path, exporting)))
    )
    resolve({path, exports: Object.freeze(exports)})
  }

  let load = (exportingFn) => (rawPath) => {
    let exporting = exportingFn ? exportingFn : () => true,
      path = withJS(rawPath),
      head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${path}`)

    head.appendChild(script)

    return new Promise((resolve, reject) => {
      script.addEventListener('load',
        onLoad(resolve, reject)(exporting)(path))
      script.addEventListener('error',
        () => reject(Error(buildErrorMsg(errors.LOAD_FILE(path)))
      ))
    })
  }

  // Loads an array of files asynchronously and recursively (!!!)
  // Calls beforeEach and afterEach before and after loading,
  // passes the current file path to each function
  let loadFiles = (exporting) => async (files, beforeEach, afterEach) => {
      let [current, ...remaining] = files

      if (!current) return {}

      if (beforeEach) beforeEach(current)

      let results = await load(exporting)(current),
        {path, exports} = results

      if (afterEach) afterEach(results)

      let others = await loadFiles(exporting)(remaining, beforeEach, afterEach)

      return Object.assign(pair(path, exports), others)
  }

  /////////// Synchronous loading functions
  // turns the raw config into what data we need here
  let parseConfig = (rawConfig) => {
    let scripts = rawConfig.scripts.map(
      (script) => `${rawConfig.scriptPath}${script}`
    ),
    mods = rawConfig.modules.map(
      (mod) => `${rawConfig.modulePath}${mod}`
    )

    return {scripts, modules: mods}
  }

  // stores the module we're loading in module.loading
  let cacheModule = (path) => {
    if (module.loading)
      throw Error(`Didn't complete loading ${modules.loading}`)

    module.loading = path
    module.exports = null
  }

  // stores the result of module loading in the modules object
  let saveModule = ({path, exports}) => {
    modules = Object.assign(modules, pair(path, exports))
    module.loading = null
  }

  // don't pollute the global scope
  let cleanUp = () => {
    module.loading = `./[= approot]`

    delete global.module
    delete global.smuggler
  }

  /////////////// DEFINE require
  // helper functions to parse relative paths
  let parsePath = (pathToFile) => {
    let atoms = pathToFile.split('/'),
      length = atoms.length,
      path = atoms.slice(0, length - 1),
      file = atoms[length - 1]

    return {path, file}
  }

  let isCurrentDir = (str) => str === '.',
    isParentDir = (str) => str === '..',
    butLast = (arr) => arr.slice(0, arr.length - 1)

    let crawlPath = (path, relativeTo) => {
      let [current, ...remaining] = path

      if (relativeTo.length < 1)
        throw Error(buildErrorMsg(
          errors.OUT_OF_SCOPE()
        ))
      if (isParentDir(current)) return crawlPath(remaining, butLast(relativeTo))

      return relativeTo.concat(remaining)
    }

  let computePath = (path, relativeTo) => {
    let [current, ...remaining] = path

    if (isCurrentDir(current)) return relativeTo.concat(remaining).join('/')
    if (isParentDir(current)) return crawlPath(path, relativeTo).join('/')

    throw Error(buildErrorMsg(errors.BAD_PATH(path)))
  }

  // the require goodness // it's remarkably easy!
  let require = (path) => {
    if (typeof path !== 'string')
      throw Error(buildErrorMsg(errors.REQUIRE_STRING(path)))

    let requirePath

    try {
      let loadingFrom = parsePath(module.loading),
        relative = parsePath(path),
        absolute = computePath(relative.path, loadingFrom.path)

      requirePath = withJS(`${absolute}/${relative.file}`)
    } catch (e) {
      throw Error(buildErrorMsg(errors.INVALID_PATH(path, module.loading), e))
    }

    let required = modules[requirePath]

    if (required) return required

    throw Error(buildErrorMsg(errors.REQUIRE_MODULE(path)))
  }

  ////////////// STOP DEFINING FUNCTIONS
  ///////////// Start loading things
  // give smuggler a global object to work with
  // config loads itself into this object
  let smuggler = {}

  global.smuggler = smuggler

  // export require into global scope
  // this will be the only one not removed
  global.require = require

  //////////// This is where the magic happens
  // bootstrap smuggler and then load the application
  let bootstrap = async () => {
    try {
      let rawConfig = await load(() => smuggler.config)(configScript)

      config = parseConfig(rawConfig.exports)
    } catch (e) {
      throw Error(buildErrorMsg(errors.LOAD_CONFIG(configScript), e))
    }

    try {
      let scripts = await loadFiles()(config.scripts)
    } catch (e) {
      throw Error(buildErrorMsg(errors.LOAD_SCRIPTS(), e))
    }

    try {
      modules = await
        loadFiles(() => module.exports)(config.modules, cacheModule, saveModule)
    } catch (e) {
      throw Error(buildErrorMsg(errors.LOAD_MODULES(), e))
    }

    try {
      module.loading = main
      let final = await load()(main)
    } catch (e) {
      throw Error(buildErrorMsg(errors.LOAD_MAIN(main), e))
    }

    cleanUp()
  }

  // load it up!
  bootstrap()

})(window)

(global => {

  let turtlejs = {}

  turtlejs.moduleDir = './turtlejs'
  turtlejs.libDir = './library'

  turtlejs.modules = [
    'directionalTriangle',
    'path',
    'hud',
    'turtle',
    'turtleCommand',
    'listener',
    'language'
  ]

  turtlejs.library = [
    'p5.min',
    'helpers'
  ]

  let loadingSuccess = (name, error) => {
    console.log(`Successfully loaded ${name}!`)
  }

  let loadingError = (name, error) => {
    console.log(`Could not load script ${name}.`)
  }

  let loadFile = (fileName, onLoad, onError) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${fileName}`)

    script.addEventListener('load', e => onLoad(fileName, e))
    script.addEventListener('error', e => onError(fileName, e))

    head.appendChild(script)
  }

  let composeLoader = directory => {
    let loader = (name, loaded, error) => {
      loadFile(`${directory}/${name}.js`, loaded, error)
    }

    return loader
  }

  let loadModule = composeLoader(turtlejs.moduleDir),
    loadLibraryItem = composeLoader(turtlejs.libDir)

  let loadModules = modules => {
    let [next, ...remaining] = modules

    if (next) {
      loadModule(next, () => loadModules(remaining), loadingError)
    } else {
      loadFile(`index.js`, () => false, loadingError)
    }
  }

  let loadLibrary = library => {
    let [next, ...remaining] = library

    if (next) {
      loadLibraryItem(next, () => loadLibrary(remaining), loadingError)
    } else {
      loadModules(turtlejs.modules)
    }
  }

  loadLibrary(turtlejs.library)

  turtlejs.load = name => {
    loadFile(`${name}.js`, loadingSuccess, loadingError)
  }

  global.turtlejs = turtlejs

})(window)

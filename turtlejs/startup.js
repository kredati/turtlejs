(global => {

  let turtlejs = {}

  turtlejs.libDir = './turtlejs'

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

  let load = (fileName, onLoad, onError) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${fileName}`)

    script.addEventListener('load', e => onLoad(fileName, e))
    script.addEventListener('error', e => onError(fileName, e))

    head.appendChild(script)
  }

  let loadModule = (name, loaded, error) => {
    load(`${turtlejs.libDir}/${name}.js`, loaded, error)
  }

  let loadModules = modules => {
    let [next, ...remaining] = modules

    if (next) {
      loadModule(next, () => loadModules(remaining), loadingError)
    } else {
      load(`index.js`, () => false, loadingError)
    }
  }

  let loadLibrary = library => {
    let [next, ...remaining] = library

    if (next) {
      load(`./library/${next}.js`, () => loadLibrary(remaining), loadingError)
    } else {
      loadModules(turtlejs.modules)
    }
  }

  loadLibrary(turtlejs.library)

  turtlejs.load = name => {
    load(`${name}.js`, loadingSuccess, loadingError)
  }

  global.turtlejs = turtlejs

})(window)

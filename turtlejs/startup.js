(global => {

  let turtlejs = {}

  turtlejs.libDir = './turtlejs'

  turtlejs.modules = [
    'directionalTriangle',
    'path',
    'hud',
    'turtle',
    'turtleCommand',
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

  let load = (fileName, onload, onerror) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${fileName}`)

    script.addEventListener('load', e => onload(fileName, e))
    script.addEventListener('error', e => onerror(fileName, e))

    head.appendChild(script)
  }

  let loadModule = (name, loaded, error) => {
    load(`${turtlejs.libDir}/${name}.js`, loaded, error)
  }

  let loadModules = modules => {
    let mods = modules

    if (modules.length > 0) {
      let nextModule = mods[0]

      mods = mods.slice(1, mods.length)
      loadModule(nextModule, () => loadModules(mods), loadingError)
    } else {
      load(`index.js`, () => false, loadingError)
    }
  }

  let loadLibrary = library => {
    let lib = library

    if (lib.length > 0) {
      let nextLib = lib[0]

      lib = lib.slice(1, library.length)
      load(`./library/${nextLib}.js`, () => loadLibrary(lib), loadingError)
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

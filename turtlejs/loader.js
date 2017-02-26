let turtleLib = './turtlejs/'

let root = () => {
  let href = window.location.href

  return href.slice(0, href.lastIndexOf('/') + 1)
}

let ready = name => {
  console.log(`Successfully loaded ${name}!`)
}

let loadingError = error => {
  console.log(`Could not load script: ${error}`)
}

let load = (fileName, onload, onerror) => {
    let head = document.getElementsByTagName('head').item(0),
      script = document.createElement('script')

    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', `${fileName}`)

    script.addEventListener('load', onload)
    script.addEventListener('error', onerror)

    head.appendChild(script)
}

let loadScript = name => {
  load(`${name}.js`, ready, loadingError)
}

let loadModule = (name, loaded, error) => {
  console.log(`Loading module ${name}.`)
  load(`${turtleLib}${name}.js`, loaded, error)
}

let modules = [
  'helpers',
  'directionalTriangle',
  'path',
  'turtle',
  'turtleCommand',
  'language'
]

let loadModules = () => {
  if (modules.length > 0) {
    let nextModule = modules[0]

    modules = modules.slice(1, modules.length)

    loadModule(nextModule, loadModules, loadingError)
  } else {
    console.log('Done loading modules.')
    loadScript('index')
  }
}

loadModules()

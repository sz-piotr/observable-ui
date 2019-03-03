const { Observable } = rxjs
const { scan, map } = rxjs.operators

// App

function reducer (state = 0, action) {
  if (action === 'INCREMENT') {
    return state + 1
  }
  return state
}

function App (state, dispatch) {
  const button = document.createElement('button')
  const buttonText = document.createTextNode('Increment')
  button.appendChild(buttonText)
  button.addEventListener('click', () => dispatch('INCREMENT'))

  const valueDiv = document.createElement('div')
  const valueText = document.createTextNode(state)
  valueDiv.appendChild(valueText)

  const appDiv = document.createElement('div')
  appDiv.appendChild(button)
  appDiv.appendChild(valueDiv)

  return appDiv
}

// Runtime

const actions = new Observable(function (subscriber) {
  function dispatch (action) {
    subscriber.next([action, dispatch])
  }
  dispatch('INIT')
})

const makeState = nextState =>
  scan(
    ([state], [action, dispatch]) => [nextState(state, action), dispatch],
    [undefined]
  )

function render (element) {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  app.appendChild(element)
}

actions
  .pipe(makeState(reducer))
  .pipe(map(([state, dispatch]) => App(state, dispatch)))
  .subscribe(render)

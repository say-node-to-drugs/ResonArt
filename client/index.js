import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from './store'
import App from './app'

import Firebase from './firebase/Firebase.js'

const FirebaseContext = React.createContext(null)

console.log('CONTEXT: ', FirebaseContext)

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
)
console.log('WITH CONTEXT: ', withFirebase)

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById('app')
)

export {FirebaseContext, withFirebase}

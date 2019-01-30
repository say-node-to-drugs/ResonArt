import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from './store'
import App from './app'

import Firebase from './firebase/Firebase.js'

import {FirebaseContext} from './firebase/FirebaseContext.js'

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

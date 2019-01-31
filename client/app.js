import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Login, Studio, Navbar} from './components'
import {SignUpPage} from './components/login-signup/SignUpIndex'
import {SignInPage} from './components/login-signup/SignInIndex'
import {SignOutIndex} from './components/login-signup/SignOutIndex'
import {withFirebase} from './firebase/FirebaseContext'
import {AuthUserContext} from './components/login-signup/SessionContext.js'
import {withAuthentication} from './components/login-signup/withAuthentication.js'

const App = props => (
  <Router>
    <div>
      <Navbar firebase={props.firebase} />

      {/* Routes placed here are available to all visitors */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/studio" component={Studio} />
      <Route path="/signout" component={SignOutIndex} />
      {/* <Route path="/canvas" component={Canvas} /> */}
      {/* Displays our Login component as a fallback */}
      <Route component={Studio} />
    </div>
  </Router>
)

export default withAuthentication(App)

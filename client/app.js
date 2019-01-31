import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Login, Studio, Navbar} from './components'
import {SignUpPage} from './components/login-signup/SignUpIndex'
import {SignInPage} from './components/login-signup/SignInIndex'
import {SignOutIndex} from './components/login-signup/SignOutIndex'
import {AccountIndex} from './components/login-signup/AccountIndex'
import {AdminIndex} from './components/admin/AdminIndex'
import {withAuthentication} from './components/login-signup/withAuthentication.js'

const App = props => (
  <Router>
    <div>
      <Navbar firebase={props.firebase} />
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/account" component={AccountIndex} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/studio" component={Studio} />
        <Route path="/signout" component={SignOutIndex} />
        <Route path="/admin" component={AdminIndex} />
        {/* Displays our Login component as a fallback */}
        <Route component={Studio} />
      </Switch>
    </div>
  </Router>
)

export default withAuthentication(App)

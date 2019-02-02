import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Login, Studio, Navbar} from './components'
import {SignUpPage} from './components/login-signup/SignUpIndex'
import {SignInPage} from './components/login-signup/SignInIndex'
import {SignOutIndex} from './components/login-signup/SignOutIndex'
import {AccountIndex} from './components/login-signup/AccountIndex'
import {PasswordForgetPage} from './components/login-signup/PasswordForget.js'
import {AdminIndex} from './components/admin/AdminIndex'
import {withAuthentication} from './components/login-signup/withAuthentication.js'
import {AuthUserContext} from './components/login-signup/SessionContext.js'

const App = props => (
  <Router>
    <div className="app">
      <Navbar firebase={props.firebase} />
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/account" component={AccountIndex} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/signin" component={SignInPage} />
        <Route
          path="/studio"
          render={() => <Studio {...props} firebase={props.firebase} />}
        />

        <Route path="/signout" component={SignOutIndex} />
        <Route path="/forgot" component={PasswordForgetPage} />
        <Route path="/admin" component={AdminIndex} />
        {/* Displays our Login component as a fallback */}
        <Route render={() => <Studio {...props} firebase={props.firebase} />} />
      </Switch>
    </div>
  </Router>
)

export default withAuthentication(App)

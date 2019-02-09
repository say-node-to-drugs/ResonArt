import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Studio, Navbar} from './components'
import {Login, CreateAccount} from './components/index'
import AccountIndex from './components/login-signup/AccountIndex'
import {PasswordForgetPage} from './components/login-signup/PasswordForget.js'
import {AdminIndex} from './components/admin/AdminIndex'
import {withAuthentication} from './components/login-signup/withAuthentication.js'
import {AuthUserContext} from './components/login-signup/SessionContext.js'
import LandingPage from './components/LandingPage'

const App = props => (
  <Router>
    <div className="app">
      <Navbar firebase={props.firebase} />
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route
          path="/account"
          render={() => <AccountIndex {...props} firebase={props.firebase} />}
        />
        <Route path="/signup" component={CreateAccount} />
        <Route path="/signin" component={Login} />
        <Route
          path="/studio"
          render={() => <Studio {...props} firebase={props.firebase} />}
        />
        <Route
          path="/home"
          render={() => <LandingPage {...props} firebase={props.firebase} />}
        />
        <Route path="/forgot" component={PasswordForgetPage} />
        <Route
          path="/forgot"
          render={() => (
            <PasswordForgetPage {...props} firebase={props.firebase} />
          )}
        />
        <Route path="/admin" component={AdminIndex} />
        {/* Displays our Login component as a fallback */}
        <Route render={() => <Studio {...props} firebase={props.firebase} />} />
      </Switch>
    </div>
  </Router>
)

export default withAuthentication(App)

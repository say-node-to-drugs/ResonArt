import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Login, Studio, Navbar} from './components'
import {SignUpPage} from './components/login-signup/SignUpIndex'
import {SignInPage} from './components/login-signup/SignInIndex'
import {SignOutIndex} from './components/login-signup/SignOutIndex'
import {withFirebase} from './firebase/FirebaseContext'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      authUser: null
    }
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? this.setState({authUser}) : this.setState({authUser: null})
    })
  }

  componentWillUnmount() {
    this.listener()
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar
            authUser={this.state.authUser}
            firebase={this.props.firebase}
          />

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
  }
}

export default withFirebase(App)

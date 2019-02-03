import React, {Component} from 'react'
import {withFirebase} from '../../firebase/FirebaseContext.js'
import {compose} from 'recompose'
import {Link, withRouter} from 'react-router-dom'

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props)

    this.state = {error: null}
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).update({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          roles: []
        })
      })
      .then(() => {
        this.setState({error: null})
        this.props.history.push('/home')
      })
      .catch(error => {
        this.setState({error})
      })

    event.preventDefault()
  }

  render() {
    const {error} = this.state

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign In with Google</button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

export const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase)

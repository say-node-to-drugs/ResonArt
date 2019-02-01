import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import {withFirebase} from '../../firebase/FirebaseContext.js'

export const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
)

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  loading: true
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = {...INITIAL_STATE}
  }

  onChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  onSubmit = event => {
    event.preventDefault()
    const {username, email, passwordOne} = this.state

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        })
      })
      .then(() => {
        this.setState({...INITIAL_STATE})
        this.props.history.push('/home')
      })
      .catch(error => {
        this.setState({error})
      })
  }

  render() {
    const {username, email, passwordOne, passwordTwo, error} = this.state

    console.log('INIT ', withFirebase)

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <div>
        <h1>TEST!!</h1>
        <form onSubmit={this.onSubmit}>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to="/signup">Sign Up</Link>
  </p>
)

export const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase)

export {SignUpLink}

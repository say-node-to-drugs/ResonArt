import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import {SignUpLink} from './SignUpIndex'
import {withFirebase} from '../../firebase/FirebaseContext.js'

export const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignUpLink />
  </div>
)

console.log('INIT 2 ', withFirebase)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignInFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = {...INITIAL_STATE}
  }

  onSubmit = event => {
    const {email, password} = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({...INITIAL_STATE})
        this.props.history.push('/home')
      })
      .catch(error => {
        this.setState({error})
      })

    event.preventDefault()
  }

  onChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {email, password, error} = this.state

    console.log('RENDER 1')

    const isInvalid = password === '' || email === ''

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

export const SignInForm = compose(withRouter, withFirebase)(SignInFormBase)

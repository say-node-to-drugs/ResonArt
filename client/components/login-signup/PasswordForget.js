import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {
  withStyles,
  Button,
  Paper,
  FormControl,
  Input,
  InputLabel,
  CssBaseline,
  Typography
} from '@material-ui/core'

import {withFirebase} from '../../firebase/FirebaseContext.js'

export const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
)

const INITIAL_STATE = {
  email: '',
  error: null
}

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = {...INITIAL_STATE}
  }

  onSubmit = event => {
    const {email} = this.state

    console.log('PASSWORD RESET')

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({...INITIAL_STATE})
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
    const {email, error} = this.state
    const {classes} = this.props

    const isInvalid = email === ''

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Paper className={classes.password}>
          <Typography component="h1" variant="h5">
            Password Reset
          </Typography>
          <form onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Email Address"
                value={this.state.email}
                onChange={this.onChange}
                autoFocus
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
            >
              Reset My Password
            </Button>
            {error && <p>{error.message}</p>}
          </form>
        </Paper>
      </div>
    )
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to="/forgot">Forgot Password?</Link>
  </p>
)

const PasswordForgetForm = withFirebase(PasswordForgetFormBase)

export {PasswordForgetForm, PasswordForgetLink}

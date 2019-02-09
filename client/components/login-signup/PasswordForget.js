import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
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

export const PasswordForgetPage = props => (
  <div>
    <h1 align="center">I forgot My Password!</h1>
    <PasswordForgetForm props={props} />
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
    const isInvalid = email === ''

    return (
      <div align="center">
        <CssBaseline />
        <Paper>
          <Typography component="h1" variant="h5" align="center">
            We will email you a link to reset it
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

PasswordForgetForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export {PasswordForgetForm, PasswordForgetLink}

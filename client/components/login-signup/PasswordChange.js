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

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props)

    this.state = {...INITIAL_STATE}
  }

  onSubmit = event => {
    const {passwordOne} = this.state

    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const {passwordOne, passwordTwo, error} = this.state
    const {classes} = this.props
    const isInvalid = passwordOne !== passwordTwo || passwordOne === ''

    return (
      <div align="center">
        <CssBaseline />
        <Paper className={classes.password}>
          <br />
          <Typography component="h1" variant="h5" align="center">
            Change Your Password?
          </Typography>
          <form onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="new-password">New password</InputLabel>
              <Input
                id="new-password"
                name="new-password"
                type="text"
                placeholder="New Password"
                value={passwordOne}
                onChange={this.onChange}
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="retype-password">Retype password</InputLabel>
              <Input
                id="retype-password"
                name="retype-password"
                type="text"
                placeholder="Retype Password"
                value={passwordOne}
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
              Change My Password
            </Button>
            <br />
            {error && <p>{error.message}</p>}
          </form>
        </Paper>
      </div>
    )
  }
}

export default withFirebase(PasswordChangeForm)

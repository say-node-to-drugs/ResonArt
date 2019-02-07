import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'
// import {SignUpLink} from './SignUpIndex'
import {PasswordForgetLink} from './PasswordForget.js'
import {withFirebase} from '../../firebase/FirebaseContext.js'
import {SignInGoogle} from './SignInGoogle'
import {SignInFacebook} from './SignInFacebook'
import {SignInTwitter} from './SignInTwitter'
import {
  withStyles,
  Button,
  Paper,
  Grid,
  FormControl,
  Input,
  InputLabel,
  CssBaseline,
  Avatar,
  LockIcon,
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import toastr from 'toastr'

toastr.options = {
  timeOut: 2000
}

const styles = theme => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignInForm extends Component {
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
        this.props.history.push('/studio')
        toastr.success('Welcome')
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
    const isInvalid = password === '' || email === ''
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={this.onChange}
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                value={password}
                onChange={this.onChange}
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
              Sign In
            </Button>
            {error && <p>{error.message}</p>}
          </form>
          <SignInGoogle />
          <SignInFacebook />
          <SignInTwitter />
          <PasswordForgetLink />
          <Typography>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </Paper>
      </div>
    )
  }
}

SignInForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(
  withRouter,
  withFirebase,
  withStyles(styles, SignInForm)
)(SignInForm)

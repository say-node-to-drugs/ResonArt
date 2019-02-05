import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import {withFirebase} from '../../firebase/FirebaseContext.js'
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
import PropTypes from 'prop-types'

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
        return this.props.firebase.user(authUser.user.uid).update({
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
    const {classes} = this.props

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          <form onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Username</InputLabel>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={this.onChange}
                autoFocus
              />
            </FormControl>
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
              <InputLabel htmlFor="passwordOne">Password</InputLabel>
              <Input
                name="passwordOne"
                type="password"
                id="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwordTwo">Password</InputLabel>
              <Input
                name="passwordTwo"
                type="password"
                id="passwordTwo"
                value={passwordTwo}
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
              Create Account
            </Button>
            {error && <p>{error.message}</p>}
          </form>
        </Paper>
      </div>
    )
  }
}

SignUpFormBase.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(
  withRouter,
  withFirebase,
  withStyles(styles, SignUpFormBase)
)(SignUpFormBase)

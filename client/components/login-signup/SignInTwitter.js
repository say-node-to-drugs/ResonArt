import React, {Component} from 'react'
import {withFirebase} from '../../firebase/FirebaseContext.js'
import {compose} from 'recompose'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {withStyles, Button} from '@material-ui/core'

const styles = theme => ({
  submit: {
    marginTop: theme.spacing.unit * 3
  }
})

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props)

    this.state = {error: null}
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).update({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
        })
      })
      .then(() => {
        // this.setState({ error: null });
        // this.props.history.push('/home');
      })
      .catch(error => {
        this.setState({error})
      })

    event.preventDefault()
  }

  render() {
    const {classes} = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In With Twitter
        </Button>
      </form>
    )
  }
}

SignInTwitterBase.propTypes = {
  classes: PropTypes.object.isRequired
}

export const SignInTwitter = compose(
  withRouter,
  withFirebase,
  withStyles(styles, SignInTwitterBase)
)(SignInTwitterBase)

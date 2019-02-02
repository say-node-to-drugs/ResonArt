import React, {Component} from 'react'
import {withFirebase} from '../../firebase/FirebaseContext.js'
import {compose} from 'recompose'
import {Link, withRouter} from 'react-router-dom'

class SignInTwitterBase extends Component {
    constructor(props) {
      super(props);
  
      this.state = { error: null };
    }
  
    onSubmit = event => {
        console.log(this.props)
        this.props.firebase
          .doSignInWithTwitter()
          .then(socialAuthUser => {
            // Create a user in your Firebase Realtime Database too
            return this.props.firebase
              .user(socialAuthUser.user.uid)
              .set({
                username: socialAuthUser.additionalUserInfo.profile.name,
                email: socialAuthUser.additionalUserInfo.profile.email,
                roles: [],
              });
          })
          .then(() => {
            // this.setState({ error: null });
            // this.props.history.push('/home');
          })
          .catch(error => {
            this.setState({ error });
          });
    
        event.preventDefault();
      };
  
    render() {
      const { error } = this.state;
  
      return (
        <form onSubmit={this.onSubmit}>
          <button type="submit">Sign In with Twitter</button>
  
          {error && <p>{error.message}</p>}
        </form>
      );
    }
  }

export const SignInTwitter = compose(
    withRouter,
    withFirebase,
  )(SignInTwitterBase);

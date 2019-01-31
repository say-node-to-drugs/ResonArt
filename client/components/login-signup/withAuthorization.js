import React from 'react'
import {withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import {withFirebase} from '../../firebase/FirebaseContext.js'
import {AuthUserContext} from './SessionContext.js'

export const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push('/signin')
        }
      })
    }

    componentWillUnmount() {
      this.listener()
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            (condition(authUser) ? <Component {...this.props} /> : null)
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(withRouter, withFirebase)(WithAuthorization)
}

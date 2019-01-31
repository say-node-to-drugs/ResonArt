import React from 'react'

import {PasswordForgetForm} from './PasswordForget.js'
import PasswordChangeForm from './PasswordChange.js'
import {withAuthorization} from './withAuthorization.js'
import {AuthUserContext} from './SessionContext.js'

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
)

const condition = authUser => !!authUser

export default withAuthorization(condition)(AccountPage)

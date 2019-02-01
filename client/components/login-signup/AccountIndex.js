import React from 'react'

import {PasswordForgetForm} from './PasswordForget.js'
import PasswordChangeForm from './PasswordChange.js'
import {withAuthorization} from './withAuthorization.js'
import {AuthUserContext} from './SessionContext.js'

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        {console.log('ACCOUNT: ', authUser)}
        <h1>Account: Welcome, {authUser.email}, you cheeky monkey!</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
)

const condition = authUser => !!authUser

export const AccountIndex = withAuthorization(condition)(AccountPage)

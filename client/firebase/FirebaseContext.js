import React from 'react'

export const FirebaseContext = React.createContext(null)

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {Firebase => <Component {...props} firebase={Firebase} />}
  </FirebaseContext.Consumer>
)

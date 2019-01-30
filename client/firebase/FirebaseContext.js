import React from 'react'
import Firebase from './Firebase.js'

export const FirebaseContext = React.createContext(null)

console.log('CONTEXT: ', FirebaseContext)

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {Firebase => <Component {...props} firebase={Firebase} />}
  </FirebaseContext.Consumer>
)
console.log('WITH CONTEXT: ', withFirebase)

import app from 'firebase/app'
import 'firebase/auth'
import {FirebaseContext, withFirebase} from '../index'

const config = {
  apiKey: 'AIzaSyDxrr24gmcAoVBOJ7OScTH-hP8SpyRrB6Q',
  authDomain: 'resonart-e0d65.firebaseapp.com',
  databaseURL: 'https://resonart-e0d65.firebaseio.com',
  projectId: 'resonart-e0d65',
  storageBucket: 'resonart-e0d65.appspot.com',
  messagingSenderId: '584412746733'
}

/*
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
}
*/

class Firebase {
  constructor() {
    app.initializeApp(config)
    console.log('TEST, ', config)

    this.auth = app.auth()
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)
}

export default Firebase
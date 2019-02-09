import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {withFirebase} from '../../firebase/FirebaseContext'
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
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import {PasswordForgetForm} from './PasswordForget.js'
import PasswordChangeForm from './PasswordChange.js'
import {withAuthorization} from '../login-signup/withAuthorization.js'
import {AuthUserContext} from '../login-signup/SessionContext.js'
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
    width: 200,
    height: 125,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    margin: `${theme.spacing.unit}px`
  },
  password: {
    width: 600,
    height: 280,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    margin: `${theme.spacing.unit}px`
  },
  passwordReset: {
    width: 600,
    height: 140,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    margin: `${theme.spacing.unit}px`
  },
  accountContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-center',
    paddingTop: 'inherit',
    margin: `${theme.spacing.unit * 3}px`
  }
})

const fireObjectToArray = fireObject => {
  return fireObject.map(element => {
    let newArray = []
    for (let key in element) {
      if (element[key] === -1) {
        element[key] = []
      } else {
        element[key] = [element[key]]
      }
      newArray.push(element[key])
    }
    return element.flat()
  })
}

export const loadCanvasFirebase = async firebase => {
  firebase.loaded = []
  let newObjectArray = []

  const userCanvas = firebase
    .user(firebase.auth.currentUser.uid)
    .child('canvas')

  return userCanvas
    .once('value', async function(snapshot) {
      let snapshotObject = await snapshot.val()
      for (let key in snapshotObject) {
        newObjectArray.push(snapshotObject[key])
      }
      return newObjectArray
    })
    .then(() => {
      for (let i = 0; i < newObjectArray.length; i++) {
        firebase.loaded.push(newObjectArray[i].canvasData)
      }
      return firebase.loaded
    })
    .catch(error => {
      toastr.error(error)
    })
}

const CanvasRender = ({classes, props}) => {
  if (props.firebase.loaded < 1) {
    return <div />
  } else {
    return (
      <div className={classes.accountContainer}>
        {props.firebase.loaded.map((singleCanvas, index) => {
          return (
            <div key={'CNV' + index}>
              <Paper className={classes.paper}>
                <Link
                  to="/studio"
                  {...props}
                  onClick={() => {
                    props.firebase.loaded.selectedNumber = index
                    props.firebase.loadPreset = singleCanvas
                    singleCanvas.black = fireObjectToArray(
                      singleCanvas.black,
                      'black'
                    )
                    singleCanvas.blue = fireObjectToArray(
                      singleCanvas.blue,
                      'blue'
                    )
                    singleCanvas.red = fireObjectToArray(
                      singleCanvas.red,
                      'red'
                    )

                    console.log('SELECTED CANVAS DATA: ', singleCanvas)
                  }}
                >
                  <img
                    src={singleCanvas.dataURL.imageData}
                    width="100px"
                    height="80px"
                  />
                  <Typography component="span">
                    <p2>{singleCanvas.filename}</p2>
                  </Typography>
                </Link>
              </Paper>
            </div>
          )
        })}
      </div>
    )
  }
}

const callName = user => {
  if (user) {
    return user.email
  } else {
    return user.email
  }
}

const INITIAL_STATE = {
  palettes: [],
  loadPreset: false
}

class AccountIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {...INITIAL_STATE}
  }
  async componentDidMount() {
    this.setState({
      palettes: await loadCanvasFirebase(this.props.firebase)
    })
  }

  render() {
    const {classes} = this.props
    if (this.state.palettes.length) {
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <div>
                <br />
                <Typography component="h1" variant="h5" align="center">
                  Welcome, {callName(this.props.firebase.auth.currentUser)}
                </Typography>
                <br />
                <Typography component="h1" variant="h5" align="center">
                  Select a saved canvas:
                </Typography>
                <div>
                  <CanvasRender classes={classes} props={this.props} />
                </div>
                <br />
                <div>
                  <PasswordChangeForm
                    alignItems="center"
                    justify="center"
                    classes={classes}
                  />
                </div>
              </div>
            </div>
          )}
        </AuthUserContext.Consumer>
      )
    } else {
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <div>
                <br />
                <Typography component="h1" variant="h4">
                  Welcome, {callName(this.props.firebase.auth.currentUser)}
                </Typography>
                <br />
                <Typography component="h1" variant="h5">
                  No canvases currently saved.
                </Typography>
                <br />
                <div style={{textAlign: 'flex-center'}}>
                  <PasswordForgetForm classes={classes} />
                </div>
              </div>
            </div>
          )}
        </AuthUserContext.Consumer>
      )
    }
  }
}

AccountIndex.propTypes = {
  classes: PropTypes.object.isRequired
}

const condition = authUser => !!authUser

export default compose(
  withRouter,
  withFirebase,
  withStyles(styles),
  withAuthorization(condition)
)(AccountIndex)

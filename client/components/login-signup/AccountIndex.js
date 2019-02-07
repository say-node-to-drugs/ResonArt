import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {withFirebase} from '../../firebase/FirebaseContext'
import {withStyles, Typography, Paper} from '@material-ui/core'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import {withAuthorization} from '../login-signup/withAuthorization.js'
import {AuthUserContext} from '../login-signup/SessionContext.js'

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
    width: 80,
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
})

const fireObjectToArray = (fireObject, color) => {
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
    return newArray
  })
}

export const loadCanvasFirebase = async firebase => {
  firebase.loaded = []
  let newObjectArray = []

  console.log('USER: ', firebase.auth.currentUser)

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
      console.log('VALUE FROM LOAD COMPONENT: ', firebase.loaded)
      return firebase.loaded
    })
    .catch(error => {
      console.log(error)
    })
}

const CanvasRender = ({classes, props, state, preset}) => {
  return (
    <div>
      {props.firebase.loaded.map((singleCanvas, index) => {
        return (
          <div key={'CNV' + index}>
            <Paper className={classes.paper}>
              <Link
                to="/studio"
                {...props}
                onClick={() => {
                  singleCanvas.loadPreset = true
                  props.firebase.loaded.selectedNumber = index
                  singleCanvas.black = fireObjectToArray(
                    singleCanvas.black,
                    'black'
                  )
                  singleCanvas.blue = fireObjectToArray(
                    singleCanvas.blue,
                    'blue'
                  )
                  singleCanvas.red = fireObjectToArray(singleCanvas.red, 'red')
                  console.log(singleCanvas)
                }}
              >
                <img
                  src={singleCanvas.dataURL.imageData}
                  width="80px"
                  height="80px"
                />
                <Typography>{singleCanvas.filename}</Typography>
              </Link>
            </Paper>
          </div>
        )
      })}
    </div>
  )
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
    console.log(this.state)
    if (this.state.palettes.length) {
      let preset1 = this.state.palettes[1].dataURL.imageData
      return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <CanvasRender
                classes={classes}
                props={this.props}
                state={this.state}
                preset={preset1}
              />
            </div>
          )}
        </AuthUserContext.Consumer>
      )
    }
    return <div>Loading...</div>
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

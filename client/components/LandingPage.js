import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {withFirebase} from '../firebase/FirebaseContext'
import {withStyles, Typography, Paper} from '@material-ui/core'
import { compose } from 'recompose';
import PropTypes from 'prop-types'

let example
let loaded = false;
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
    width: 300,
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
})

const INITIAL_STATE = {
  palettes: []
}

class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {...INITIAL_STATE}
  }
  async componentDidMount() {
    this.setState({
      palettes: await loadCanvasFromFirebase(this.props.firebase)})
    loaded = true;
  }
  render() {
    const {classes} = this.props
    console.log(this.state)
    if(this.state.palettes.length) {
      let preset1 = this.state.palettes[0].dataURL.imageData
      return (
        <div>
          <Paper className={classes.paper}>
            <Link to='/studio' {...this.props}>
              <img src={preset1} width='300px' height='200px'/>
              <Typography>{this.state.palettes[0].filename}</Typography>
            </Link>
          </Paper>
        </div>
      )
    }
    return (<div>Loading...</div>)
  }
}



export const loadCanvasFromFirebase = async (firebase) => {
    firebase.loaded = []
    let newObjectArray = []

    const userCanvas = firebase
      .user('9s3CSIwdJFPLJsHCDysduRClZ7i1')
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

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(withRouter, withFirebase, withStyles(styles))(LandingPage)
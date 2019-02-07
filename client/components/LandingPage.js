import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {withFirebase} from '../firebase/FirebaseContext'
import {withStyles, Typography, Paper} from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';
import {compose} from 'recompose'
import PropTypes from 'prop-types'

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
    marginTop: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
})

const INITIAL_STATE = {
  palettes: [],
  loadPreset: false
}

class LandingPage extends Component {
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
      let presets = this.state.palettes;
      console.log(presets)
      return (
        <div>
          <div className='presetList'>
            <Avatar src='soundWave.jpg' width='200px' height='200px' />
            <Typography variant='display1' align='center'>
              Welcome to ResonArt! 
            </Typography>
            <Typography variant='body1'>  
              Drawing never sounded so good.
              Get started by clicking 'New Canvas' in the navigation bar, or click on one of the presets below!
            </Typography>
          </div>
          <Typography variant='headline'>
            Canvas Presets
          </Typography>
          <div className='presetList'>
            {
              presets.map((preset, index) => (
                <Paper className={classes.paper}>
                  <Link to="/studio" {...this.props} onClick={() => {
                    this.props.firebase.selectedNumber = index;
                    this.props.firebase.loadPreset = preset;
                  }}>
                    <img src={preset.dataURL.imageData} width="300px" height="200px" />
                    <Typography align='center' variant='title'>{ preset.filename }</Typography>
                  </Link>
                </Paper>
              ))
            }
          </div>
        </div>
      )
    }
    return <div>Loading...</div>
  }
}

export const loadCanvasFirebase = async firebase => {
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

export default compose(withRouter, withFirebase, withStyles(styles))(
  LandingPage
)

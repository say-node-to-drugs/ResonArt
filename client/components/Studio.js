import React from 'react'
import {DrumSketch} from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles, Button, Paper, Grid} from '@material-ui/core'

let imgUrl = 'blurredBackdrop.jpg'

let styles = () => ({
  root: {
    background: `url(${imgUrl}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    overflow: 'hidden',
    flexGrow: 1,
    padding: 30,
    height: 'inherit'
  },
  grow: {
    flexGrow: 1
  },
  padding: {
    padding: 30
  }
})

class Studio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.startRecord = React.createRef()
  }
  componentDidMount() {
    this.drum = new window.p5(DrumSketch, 'drumP5Wrapper')
    this.palette = new window.p5(PaletteSketch, 'paletteP5Wrapper')
    this.palette.firebase = this.props.firebase
  }

  render() {
    const {classes} = this.props
    var appUser = this.props.firebase.auth.currentUser
    console.log('STUDIO: ', appUser) // Temporarily here to analyze firebase user object
    return (
      <Grid container className={classes.root} justify="center">
        <Grid item sm={3}>
          <div className="spacer" />
        </Grid>
        <Grid item sm={6}>
          <div className="sketchPad" id="sketchPad" />
        </Grid>
        <Grid item className={classes.padding} sm={3}>
          <Grid container id="buttonManifold" spacing={16} />
        </Grid>
        <Grid item sm={12}>
          <div className="drumMachine" id="drumMachine" />
        </Grid>
        <Grid item sm={2}>
          <div className="bpmCTRL" id="bpmCTRL" />
        </Grid>
      </Grid>
    )
  }
}

Studio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Studio)

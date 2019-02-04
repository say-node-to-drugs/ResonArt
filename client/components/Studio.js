import React from 'react'
import {DrumSketch} from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles, Button, Paper, Grid} from '@material-ui/core'

let imgUrl = 'blurredBackdrop.jpg'

let styles = () => ({
  root: {
    flexGrow: 1,
    padding: 30,
    height: '93vh'
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
        <Grid item sm={3} id="spacer" className="spacer" />
        <Grid item sm={6} id="sketchPad" className="sketchPad" />
        <Grid item sm={3} className="buttonSpacer">
          <Grid
            container
            id="buttonManifold"
            className="buttonManifold"
            spacing={16}
          />
        </Grid>
        <Grid item sm={12} id="drumMachine" className="drumMachine" />
        <Grid item sm={2} id="bpmCTRL" className="bpmCTRL" />
      </Grid>
    )
  }
}

Studio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Studio)

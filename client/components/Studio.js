import React from 'react'
import {DrumSketch} from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles, Grid} from '@material-ui/core'

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
    this.bpm = React.createRef()
  }
  componentDidMount() {
    this.drum = new window.p5(DrumSketch, 'drumP5Wrapper')
    this.palette = new window.p5(PaletteSketch, 'paletteP5Wrapper')
    this.palette.firebase = this.props.firebase

    if (this.props.firebase.loaded) {
      this.palette.loadPreset = this.props.firebase.loadPreset
    }
  }
  componentWillUnmount() {
    this.palette.loadPreset = [];
    this.props.firebase.loaded = false;
  }

  render() {
    const {classes} = this.props
    return (
      <Grid container className={classes.root} justify="center">
        <Grid item sm={3} id="spacer" className="spacer" />
        <Grid item sm={6} id="sketchPad" className="sketchPad" />
        <Grid item sm={3} id="spacer" className="spacer" />
        <Grid item sm={6} id="drumMachine" className="drumMachine" />
        <Grid item sm={12} id="bpmCTRL" className="bpmCTRL" />
        <Grid item sm={12} className="buttonSpacer">
          <Grid
            container
            id="buttonManifold"
            className="buttonManifold"
            spacing={16}
          >
            <Grid item sm={4} id="synthButtons" className="synthButtons" />
            <Grid item sm={4} id="audioButtons" className="audioButtons" />
            <Grid item sm={4} id="saveButtons" className="saveButtons" />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

Studio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Studio)

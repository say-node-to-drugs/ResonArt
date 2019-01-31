import React from 'react'
import DrumSketch from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles, Button} from '@material-ui/core'

let imgUrl = 'blurredBackdrop.jpg'

let styles = {
  root: {
    backgroundImage: 'url(' + imgUrl + ')',
    backgroundSize: 'cover',
    overflow: 'hidden',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    margin: 'auto',
    padding: '30px',
    flexDirection: 'column'
  },
  grow: {
    flexGrow: 1
  }
}

class Studio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.startRecord = React.createRef()
  }
  componentDidMount() {
    this.drum = new window.p5(DrumSketch, 'drumP5Wrapper')
    this.palette = new window.p5(PaletteSketch, 'paletteP5Wrapper')
    // this.buttonManifold = new window.p5(PaletteSketch, 'buttonManifold')
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <div className="palette" id="paletteP5Wrapper">
          <div className="sketchPad" id="sketchPad" />
          <div className="buttonManifold" id="buttonManifold">
            {/* <Button
              className="button"
              id="startRecording"
              ref={this.startRecord}
            >
              Start Record
            </Button> */}
          </div>
        </div>

        <div className="drums" id="drumP5Wrapper">
          <div className="drumMachine" id="drumMachine" />
          <div className="bpmCTRL" id="bpmCTRL" />
        </div>
      </div>
    )
  }
}

Studio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Studio)

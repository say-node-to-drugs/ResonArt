import React from 'react'
import DrumSketch from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

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
  }
  componentDidMount() {
    this.canvas = new window.p5(DrumSketch, 'drumP5Wrapper')
    this.palette = new window.p5(PaletteSketch, 'paletteP5Wrapper')
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <div className="palette" id="paletteP5Wrapper" />
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

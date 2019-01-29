import React from 'react'
import DrumSketch from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'

class Studio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.drumP5Wrapper = React.createRef()
    this.paletteP5Wrapper = React.createRef()
  }
  componentDidMount() {
    this.canvas = new window.p5(DrumSketch, 'drumP5Wrapper')
    this.palette = new window.p5(PaletteSketch, 'paletteP5Wrapper')
  }

  render() {
    return (
      <div className="center">
        <div
          ref={this.paletteP5Wrapper}
          className="palette"
          id="paletteP5Wrapper"
        />
        <div ref={this.drumP5Wrapper} className="drums" id="drumP5Wrapper" />
      </div>
    )
  }
}
export default Studio

import React from 'react'
import DrumSketch from './sketches/DrumSketch'

class Drum extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.drumP5Wrapper = React.createRef()
  }
  componentDidMount() {
    this.canvas = new window.p5(DrumSketch, 'drumP5Wrapper')
  }

  render() {
    return (
      <div ref={this.drumP5Wrapper} className="center" id="drumP5Wrapper" />
    )
  }
}
export default Drum

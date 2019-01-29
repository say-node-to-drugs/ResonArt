import React from 'react'
import DrumSketch from './sketches/DrumSketch'

class Drum extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.canvas = new window.p5(DrumSketch, 'drumP5Wrapper')
  }

  render() {
    return <div className="center" id="drumP5Wrapper" />
  }
}
export default Drum

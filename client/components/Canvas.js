import React from 'react'
import CanvasSketch from './sketches/CanvasSketch'

class Canvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.canvas = new window.p5(CanvasSketch, 'canvasP5Wrapper')
  }
  render() {
    return <div className="center" id="canvasP5Wrapper" />
  }
}
export default Canvas

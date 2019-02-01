import React from 'react'
import DrumSketch from './sketches/DrumSketch'
import PaletteSketch from './sketches/PaletteSketch'
import PropTypes from 'prop-types'
import {withStyles, Button, Paper, Grid} from '@material-ui/core'

let imgUrl = 'blurredBackdrop.jpg'

let styles = theme => ({
  root: {
    // backgroundImage: `url(${imgUrl})`,
    background: `url(${imgUrl}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    overflow: 'hidden',
    flexGrow: 1
    // display: 'table',
    // justifyContent: 'center',
    // textAlign: 'center',
    // margin: 'auto',
    // padding: '50px',
    // flexDirection: 'column',
  },
  grow: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
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
  }

  render() {
    const {classes} = this.props
    return (
      // <div className={classes.root}>
      <Grid container className={classes.root} spacing={24}>
        {/* <div className="palette" id="paletteP5Wrapper"> */}
        <Grid item xs={3}>
          <div className="spacer" />
        </Grid>
        <Grid item xs={3}>
          <div className="sketchPad" id="sketchPad" />
        </Grid>
        <Grid item xs={3}>
          <div className="buttonManifold" id="buttonManifold" />
        </Grid>
      </Grid>
      // <div className="drums" id="drumP5Wrapper">
      //   <div className="drumMachine" id="drumMachine" />
      //   <div className="bpmCTRL" id="bpmCTRL" />
      // </div>
      // </div>
    )
  }
}

Studio.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Studio)

// function FullWidthGrid(props) {
//   const { classes } = props;

//   return (
//     <div className={classes.root}>
//       <Grid container spacing={24}>
//         <Grid item xs={12}>
//           <Paper className={classes.paper}>xs=12</Paper>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <Paper className={classes.paper}>xs=12 sm=6</Paper>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <Paper className={classes.paper}>xs=12 sm=6</Paper>
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <Paper className={classes.paper}>xs=6 sm=3</Paper>
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <Paper className={classes.paper}>xs=6 sm=3</Paper>
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <Paper className={classes.paper}>xs=6 sm=3</Paper>
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <Paper className={classes.paper}>xs=6 sm=3</Paper>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

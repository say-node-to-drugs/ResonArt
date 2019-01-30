import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar
} from '@material-ui/core'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {
  purple,
  red,
  white,
  blueGrey,
  yellow,
  blue
} from '@material-ui/core/colors'
import MenuIcon from '@material-ui/icons/Menu'

const theme = createMuiTheme({
  palette: {
    primary: {main: blue[900]}, // Purple and green play nicely together.
    secondary: {main: purple[500]} // This is just green.A700 as hex.
  },
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        background: `linear-gradient(45deg, ${yellow[200]} 30%, ${
          red[200]
        } 90%)`,
        borderRadius: 3,
        border: 0,
        color: 'black',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
      }
    }
  },
  typography: {useNextVariants: true}
})

const styles = {
  root: {
    backgroundImage: 'newWaveAudio.jpg',
    backgroundSize: 'cover',
    overflow: 'hidden',
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  avatar: {
    margin: 'auto'
  },
  buttonDiv: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}

function Navbar(props) {
  const {classes, handleClick, isLoggedIn} = props
  return (
    <div id="navbar" className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <div>
              <IconButton component={Link} to="/home">
                <Avatar
                  alt="ResonArt Logo"
                  src="soundWave.jpg"
                  className={classes.avatar}
                />
              </IconButton>
            </div>
            {isLoggedIn ? (
              <Typography
                component={Link}
                to="/home"
                variant="h6"
                color="secondary"
                className={classes.grow}
              >
                Logout
              </Typography>
            ) : (
              <div className={classes.buttonDiv}>
                <div className={classes.button}>
                  <Button color="secondary">Login</Button>
                </div>
                <div className={classes.button}>
                  <Button color="secondary">Signup</Button>
                </div>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(withStyles(styles)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import Firebase from '../firebase/Firebase.js'
import {AuthUserContext} from './login-signup/SessionContext.js'
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
    primary: {main: '#153243'}, // Purple and green play nicely together.
    secondary: {main: '#F4F9E9'} // This is just green.A700 as hex.
  },
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        background: 'transparent',
        borderRadius: 3,
        border: '2px solid white',
        color: 'white',
        height: 48,
        padding: '0 10px'
      }
    }
  },
  typography: {useNextVariants: true}
})

const styles = {
  root: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20vw'
  },
  button: {
    paddingLeft: 5,
    paddingRight: 5,
    width: '8vw'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}

function Navigation(props) {
  const {classes, firebase} = props
  return (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <div className={classes.buttonDiv}>
            <Button className={classes.button} component={Link} to="/account">
              Account
            </Button>
            <Button
              onClick={() => {
                firebase.doSignOut()
              }}
              to="/home"
              className={classes.button}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className={classes.buttonDiv}>
            <Button className={classes.button} component={Link} to="/signin">
              Login
            </Button>{' '}
            <Button className={classes.button} component={Link} to="/signup">
              Sign Up
            </Button>
          </div>
        )
      }
    </AuthUserContext.Consumer>
  )
}

function Navbar(props) {
  const {classes} = props
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
            {Navigation(props)}
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

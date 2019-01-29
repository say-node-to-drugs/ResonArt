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
import {purple, red, white, blueGrey} from '@material-ui/core/colors'
import MenuIcon from '@material-ui/icons/Menu'

const theme = createMuiTheme({
  palette: {
    primary: {main: blueGrey[700]}, // Purple and green play nicely together.
    secondary: {main: red[50]} // This is just green.A700 as hex.
  },
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      text: {
        // Some CSS
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
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
    margin: 5
  }
}

function Navbar(props) {
  const {classes, handleClick, isLoggedIn} = props
  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton component={Link} to="/home">
              <Avatar
                alt="Dylan"
                src="Dylan_at_Bishops.jpg"
                className={classes.avatar}
              />
            </IconButton>
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
              <div className={classes.root}>
                <Typography
                  component={Link}
                  to="/login"
                  variant="h6"
                  color="secondary"
                  className={classes.grow}
                >
                  Login
                </Typography>
                <Typography
                  component={Link}
                  to="/signup"
                  variant="h6"
                  color="secondary"
                  className={classes.grow}
                >
                  Signup
                </Typography>
                <Button color="secondary">Login</Button>
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

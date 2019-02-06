import React from 'react'
import {Link} from 'react-router-dom'
import {
  withStyles,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Avatar
} from '@material-ui/core'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {renderComponent} from 'recompose'

function SideNav(props) {
  console.log('SIDEBAR LOADED')
  return (
    <div>
      <h1>TEST</h1>
    </div>
  )
}

export default SideNav

/*
    <div class="sidenav" id="Sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()"
        >&times;</a
      >
    </div>
    <script>
      function openNav() {
        document.getElementById('Sidenav').style.width = '250px'
      }

      function closeNav() {
        document.getElementById('Sidenav').style.width = '0'
      }
    </script>
    */

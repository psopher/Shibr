// React
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// MUI
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

// Import logo image
import logoShibrInulyticsW from '../../images/logo-shibr-inulytics-w.png'

// Default profile pic
import profPicDefault from '../../images/prof-pic-default.png'

// Helper methods
import { getPayload, userIsAuthenticated } from '../../helpers/auth'
import { getProfPicFromLocalStorage } from '../../helpers/storage'

// Global Variables
const pagesNoLogin = ['Login', 'Register']
const settings = ['My Account', 'Logout']


// The navbar appears at the top of the website on all pages
const PageNavbar  = ({ mode, setMode }) => {
  
  //light/dark
  const handleChangeMode = () => {
    mode === 'light' ? setMode('dark') : setMode('light')
  }

  // Navigate
  const navigate = useNavigate()

  // Payload
  const payload = getPayload()

  // Get profile picture from local storage
  const profPic = getProfPicFromLocalStorage()
  // console.log('profpic ->', profPic)

  // Keeps track of menu
  const [anchorElUser, setAnchorElUser] = useState(null)

  //Navigate to different pages depending on which menu item is clicked
  const handleNavClick = (event) => {

    // converting page name to lower case
    const pageName = event.currentTarget.innerText.toLowerCase()

    if (pageName === 'login' || pageName === 'register') {
      handleCloseUserMenu()

      //If login or register navigate to thos pages
      navigate(`/${pageName}`)
    } else if (pageName === 'my account') {
      handleCloseUserMenu()

      //If my account, navigate to the user's account
      navigate(`/account/${payload.sub}`, { replace: true })
      
      
    } else if (pageName === 'logout') {
      handleCloseUserMenu()

      //Remove token, settings, profpic, and currentprof from local storage upon logout
      window.localStorage.removeItem('shibr')
      window.localStorage.removeItem('settings')
      window.localStorage.removeItem('profPic')
      window.localStorage.removeItem('currentProf')

      //Navigate to the login screen upon logout
      navigate('/login')
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  // Closes the user menu on the right hand side
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ fontFamily: 'Domine' }}>
        <Toolbar disableGutters>
          
          {/* Logo */}
          <Container sx={{ display: 'flex', alignItems: 'flex-end' }}>

            {/* Logo image */}
            <Box as={Link} to="/" sx={{ width: 180 }}>
              <Box component='img' src={logoShibrInulyticsW} alt="Logo" />
            </Box>
          </Container>

    
          {/* Dark Mode or Light Mode Toggle */}
          <IconButton onClick={handleChangeMode}>
            {mode === 'light' ? <DarkModeIcon sx={{ color: 'white' }} /> : <LightModeIcon />}    
          </IconButton>
          
          {/* If user is logged in, shows user menu, otherwise it shows login and register options on right side of navbar */}
          {userIsAuthenticated() ? 
            <>

              {/* If user is logged in... */}

              {/* Profile image */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2, mr: 3, boxShadow: 2 }}>
                    <Avatar alt="shiba profile pic" src={profPic ? profPic : profPicDefault} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Settings on Profile Click */}
                  {settings.map((setting, i) => (
                    <MenuItem key={i} onClick={handleNavClick}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
            :
            <>
              {/* If user is not logged in */}

              {/* Login and Register Pages Shown */}
              <Box sx={{ justifyContent: 'end', display: 'flex', mr: 3 }}>
                {pagesNoLogin.map((page, index) => (
                  <Button
                    key={index}
                    onClick={handleNavClick}
                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Lato' }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </>
          }
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default PageNavbar
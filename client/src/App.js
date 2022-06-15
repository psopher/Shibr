import { React, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import getDesignTokens from './helpers/theme.js'

// Import Components
import PageNavbar from './components/common/PageNavbar'
import Home from './components/Home'
import OverallAnalytics from './components/analytics/OverallAnalytics'
import SocialMediaMatches from './components/analytics/SocialMediaMatches'
import SingleProfileAnalytics from './components/analytics/SingleProfileAnalytics'
import NotFound from './components/common/NotFound'
import UserAccount from './components/user/UserAccount'
import NewProfile from './components/user/NewProfile'
import SingleProfile from './components/user/SingleProfile'
import Settings from './components/user/Settings'

// Auth components
import Register from './components/auth/Register'
import Login from './components/auth/Login'

//MUI
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'

const App = () => {
  const [mode, setMode] = useState('light')
  const darkTheme = createTheme(getDesignTokens(mode))

  return (
    <ThemeProvider theme={darkTheme}>
      <Box id='wrapper-box' bgcolor='background.default' color='text.primary'>
        <BrowserRouter>
          <PageNavbar setMode={setMode} mode={mode} />
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />

            {/* Auth routes - starting with register */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-profile" element={<NewProfile />} />
            <Route path="/add-settings" element={<Settings />} />

            {/* Analytics routes */}
            <Route path="/analytics/:userId" element={<OverallAnalytics />} />
            <Route path="/analytics/:userId/matches" element={<SocialMediaMatches />} />
            <Route path="/analytics/profile/:profileId" element={<SingleProfileAnalytics />} />
            <Route path="/analytics/profile/:userId/matches" element={<SocialMediaMatches />} />
            <Route path="/analytics/profile/:userId/:profileId/matches" element={<SocialMediaMatches />} />

            {/* User routes */}
            <Route path="/account/:userId" element={<UserAccount />} />
            <Route path="/account/:userId/new-profile" element={<NewProfile />} />
            <Route path="/account/:userId/settings" element={<Settings />} />
            <Route path="/account/:userId/:profileId" element={<SingleProfile />} />


            {/* The following path matches any path specified, so it needs to come last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  )
}

export default App

import React from 'react'
import { Link } from 'react-router-dom'

import shibaTail from '../../images/shiba-tail.gif'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


// 404 Not Found Page
const NotFound = () => {
  return (
    <Container sx={{ height: '70vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {/* Shiba chasing tail GIF */}
      <Box component='img' src={shibaTail} alt='shiba tail gif' sx={{ width: 150 }} />

      {/* 404 Not Found text */}
      <Typography variant='h4'>Page Not Found!</Typography>

      {/* Link back to home.js */}
      <Typography as={Link} to="/" sx={{ textDecoration: 'underline' }}>Back to Home</Typography>
    </Container>
  )
}

export default NotFound
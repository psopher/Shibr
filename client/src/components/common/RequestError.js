// React
import React from 'react'
import { Link } from 'react-router-dom'

// Images and GIFs
import shibaTail from '../../images/shiba-tail.gif'

// MUI
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


// Show this when there is a request error
const RequestError = () => {
  return (
    <Container sx={{ height: '70vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {/* Shiba chasing tail GIF */}
      <Box component='img' src={shibaTail} alt='shiba tail' sx={{ width: 150 }} />
      
      {/* Request Error text */}
      <Typography variant='h4'>Error! Could not fetch data!</Typography>
      
      {/* Link back to home.js */}
      <Typography as={Link} to="/" sx={{ textDecoration: 'underline' }}>Back to Home</Typography>
    </Container>
  )
}

export default RequestError
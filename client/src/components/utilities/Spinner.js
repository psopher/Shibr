// React
import React from 'react'

// Import spinner image
import spinner from '../../images/shiba-tail.gif'

// mui
import Box from '@mui/material/Box'

// Shows when loading
const Spinner = () => (
  <Box sx={{ width: 200 }}>

    {/* GIF of dog chasing tail */}
    <Box component='img' src={spinner} alt="Spinner" className="spinner" />
    
  </Box>
)

export default Spinner
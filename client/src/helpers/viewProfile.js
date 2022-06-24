// React
import React from 'react'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'

// Icons
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

// Retrieves a profile with the bio underneath the first image
// Called on home.js
export const getProfile = (profile, fromHome = false, karma = 0, handleSwipe) => {
  return (
    <>
      <Container key={'1'} maxWidth='xs' sx={{ my: 4 }}>
        <Box sx={{ marginLeft: '6px', borderRadius: 5 }}>
          <Masonry key={'2'} columns={{ xs: 1, sm: 1, md: 1 }} spacing={1}>
            {profile.images.map((image, index) => {
              return (
                // Image list item
                <ImageListItem key={index} >
                  <Box sx={{ boxShadow: 4, mt: 2, borderRadius: 4 }}>
                    <img
                      src={image}
                      alt={`image ${index}`}
                      loading='lazy'
                    />
                  </Box>

                  {/* Place the bio after the first photo */}
                  {index === 0 &&
                    profileBio(profile)
                  }
                </ImageListItem>
              )
            })}
          </Masonry>
        </Box>
      </Container>
      
      {/* Add a progress bar and swipe right/left buttons if it's from the home screen */}
      {fromHome === true &&
        <>
          {/* Progress Bar */}
          {karmaBar(karma, 300)}


          {/* Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Box onClick={handleSwipe} className='swipe-left' sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
              <IconButton aria-label="swipe-left" className='swipe-left' size="large" >
                <CloseOutlinedIcon fontSize="large" className='swipe-left' sx={{ color: 'secondary.main' }} />
              </IconButton>
            </Box>
            <Box onClick={handleSwipe} className='swipe-right' sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
              <IconButton aria-label="swipe-right" className='swipe-right' size="large" >
                <FavoriteOutlinedIcon fontSize="large" className='swipe-right' sx={{ color: 'primary.main' }} />
              </IconButton>
            </Box>
          </Box>
        </>
      }
    </>
  )
}

// The profile bio
export const profileBio = (profile, width = 300) => {
  return (
    <Box key={'0934t'} sx={{ width: width, display: 'flex', flexDirection: 'column', mt: 2, mb: 0 }}>
      
      {/* Name and Age */}
      <Typography variant='h6' fontWeight={'bold'}>
        {`${profile.name}, ${profile.age}`}
      </Typography>

      {/* Gender */}
      <Typography>
        {`${profile.gender}`}
      </Typography>

      {/* Training */}
      <Typography>
        {`${profile.school}`}
      </Typography>

      {/* Bio */}
      <Typography>
        {`${profile.bio}`}
      </Typography>
    </Box>
  )
}

// Progress bar that tracks karma
export const karmaBar = (karma = 0, width = 300) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <LinearProgress variant="determinate" value={karma * 20} sx={{ width: width, height: 10, border: 1, boxShadow: 4 }} />
    </Box>
  )

}
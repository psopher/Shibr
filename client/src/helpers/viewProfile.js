import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'


export const getProfile = (profile, karma = 0, fromHome = false, handleLeftSwipe, handleRightSwipe) => {
  return (
    <>
      <Container key={'1'} maxWidth='xs' sx={{ my: 4 }}>
        <Box sx={{ marginLeft: '6px', borderRadius: 5 }}>
          <Masonry key={'2'} columns={{ xs: 1, sm: 1, md: 1 }} spacing={1}>
            {profile.images.map((image, index) => {
              return (
                <ImageListItem key={index} >
                  <Box sx={{ boxShadow: 4, mt: 2 }}>
                    <img
                      src={image}
                      alt={`image ${index}`}
                      loading='lazy'
                    />
                  </Box>
                  {index === 0 &&
                    profileBio(profile, 0)
                  }
                </ImageListItem>
              )
            })}
          </Masonry>
        </Box>
      </Container>

      {/* Progress Bar */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <LinearProgress variant="determinate" value={karma * 20} sx={{ width: 200, height: 10, border: 1, boxShadow: 4 }} />
      </Box>


      {/* Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 3, mb: 4 }}>
        <Box onClick={handleLeftSwipe} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
          <IconButton aria-label="swipe-left" size="large" >
            <CloseOutlinedIcon fontSize="large" sx={{ color: 'secondary.main' }} />
          </IconButton>
        </Box>
        <Box onClick={handleRightSwipe} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
          <IconButton aria-label="swipe-right" size="large" >
            <FavoriteOutlinedIcon fontSize="large" sx={{ color: 'primary.main' }} />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}

export const profileBio = (profile, fromFeedback = false) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 0 }}>
      <Typography variant='h6' fontWeight={'bold'}>
        {`${profile.name}, ${profile.age}`}
      </Typography>
      <Typography>
        {`${profile.gender}`}
      </Typography>
      <Typography>
        {`${profile.school}`}
      </Typography>
      <Typography>
        {`${profile.bio}`}
      </Typography>
    </Box>
  )
}


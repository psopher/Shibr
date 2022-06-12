import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'


export const getImageList = (profile, xsColumns = 1, smColumns = 1, mdColumns = 1, marginY = 0, fromHome = false) => {
  return (
    <Container key={'1'} maxWidth='xs' sx={{ my: marginY }}>
      <Box sx={{ marginLeft: '6px' }}>
        <Masonry key={'2'} columns={{ xs: xsColumns, sm: smColumns, md: mdColumns }} spacing={1}>
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
                {fromHome && index === 0 &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 2 }}>
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
                }
              </ImageListItem>
            )
          })}
        </Masonry>
      </Box>
    </Container>
  )
}




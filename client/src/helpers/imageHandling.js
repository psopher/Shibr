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

import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'


export const getFeedbackImageList = (profile, bestPhotos = true, handeImageSelect) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 0, mb: 0 }}>
        <Typography variant='h6'>
          {bestPhotos ? 'Best:' : 'Worst:'}
        </Typography>
      </Box>
      <Container key={'1'} maxWidth='xs' sx={{ mb: 2, mt: 1 }}>
        <Box sx={{ marginLeft: '6px' }}>
          <Masonry key={'2'} columns={{ xs: 3, sm: 3, md: 3 }} spacing={1}>
            {profile.images.map((image, index) => {
              return (
                <ImageListItem key={index} >
                  
                  <Box
                    key={index}
                    onClick={handeImageSelect} 
                    sx={{ 
                      boxShadow: 4, 
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ebebeb',
                      // p: 1,
                      fontFamily: 'Lato',
                      '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: '#e0e0e0',
                      },
                    }}>
                    <img
                      src={image}
                      alt={index}
                      value={index}
                      loading='lazy'
                      className={bestPhotos ? 'best-photos' : 'worst-photos'}
                    />
                  </Box>
                </ImageListItem>
              )
            })}

            <ImageListItem key={100} >
              <Box 
                key={profile.images.length}
                onClick={handeImageSelect} 
                sx={{ 
                  boxShadow: 4, 
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ebebeb',
                  // p: 1,
                  fontFamily: 'Lato',
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: '#e0e0e0',
                  },
                }}>
                <img
                  src={bestPhotos ? noGoodImages : noBadImages}
                  alt={profile.images.length}
                  value={profile.images.length}
                  loading='lazy'
                  className={bestPhotos ? 'best-photos' : 'worst-photos'}
                />
              </Box>
            </ImageListItem>
          </Masonry>
        </Box>
      </Container>
    </>
  )
}




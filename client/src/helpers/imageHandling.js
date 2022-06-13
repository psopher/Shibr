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
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import LinearProgress from '@mui/material/LinearProgress'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AddIcon from '@mui/icons-material/Add'

import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'
import profPicDefault from '../images/prof-pic-default.png'

import { styled } from '@mui/material/styles'


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
                      borderRadius: 5,
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
                  borderRadius: 5,
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



export const newProfileImageList = (imageArray, handeImageSelect, handleDeleteImage) => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

  return (
    <>
      <Container key={1000} maxWidth='xs' sx={{ mb: 2, mt: 1 }}>
        <Box key={1000} sx={{ marginLeft: '6px' }}>
          <Masonry key={'1000'} columns={{ xs: 3, sm: 3, md: 3 }} spacing={1}>
            {imageArray.map((image, index) => {
              return (
                <Box key={index} sx={{ mb: 0, pb: 0 }}>
                  <ImageListItem key={index} >
                    <Box
                      key={`${index}`}
                      // onClick={handeImageSelect} 
                      sx={{ 
                        boxShadow: 4, 
                        // mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ebebeb',
                        borderRadius: 5,
                        // p: 1,
                        fontFamily: 'Lato',
                        // '&:hover': {
                        //   cursor: 'pointer',
                        //   backgroundColor: '#e0e0e0',
                        // },
                      }}>
                      <img
                        src={image ? image : profPicDefault}
                        alt={index}
                        value={index}
                        loading='lazy'
                        className={image ? 'yes-photo' : 'no-photo'}
                        key={`${index}`}
                      />
                    </Box>
                    {image ? 
                      <Box key={`${index}-2`} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Box key={`${index}-2`} onClick={handleDeleteImage} sx={{ borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
                          <IconButton key={`${index}-2`} aria-label="swipe-left" sx={{ bottom: 22, left: 0, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(10,10,10,0.6)' }} >
                            <CloseOutlinedIcon key={`${index}-2`} className={`${index}-index`} fontSize="medium" sx={{ color: 'secondary.main' }} />
                          </IconButton>
                        </Box>
                      </Box>
                      :
                      <label key={`${index}-3`} htmlFor="icon-button-file">
                        <Input key={`${index}-3`} accept="image/*" id="icon-button-file" className={`${index}-index`} type="file" onChange={handeImageSelect} />
                        <IconButton key={`${index}-4`} aria-label="upload picture" size="medium" component="span" sx={{ bottom: 22, left: 39, border: 2, borderColor: 'white', boxShadow: 3, backgroundColor: 'rgba(10,10,10,0.6)' }} >
                          <AddIcon key={`${index}-5`} sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </label>
                    
                    }
                  </ImageListItem>
                </Box>
              )
            })}
          </Masonry>
        </Box>
      </Container>
    </>
  )
}



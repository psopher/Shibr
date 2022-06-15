import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { moreProfileOptions, moreCurrentProfileOptions } from './formOptions'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Typography from '@mui/material/Typography'
import Masonry from '@mui/lab/Masonry'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import LinearProgress from '@mui/material/LinearProgress'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'
import profPicDefault from '../images/prof-pic-default.png'

import { styled } from '@mui/material/styles'
import { fontWeight } from '@mui/system'



const getRightSwipesNumber = (swipesArray) => {
  const rightSwipesArray = swipesArray.filter(swipe => swipe.right_swipe)
  return rightSwipesArray.length
} 
const getSwipesPercent = (sampleSize = 0, swipesNumber = 0) => {
  return (swipesNumber / sampleSize) * 100
} 
export const getSocialMediaMatches = (matchesArray) => {
  const socialMatchesArray = matchesArray.filter(match => match.exchange_social_media)
  return matchesArray.filter(match => match.exchange_social_media)
} 


export const getProfilesList = (profilesArray, currentProfileId = 0, open = false, handleMenuOpen, handleClose, anchorEl) => {

  return (
    <>
      <Stack key={'20'} spacing={0}>
        {profilesArray.map((profile, index) => {
          return (
            <Box key={'200'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Profile Picture */}
              <Avatar key={profile.id} alt={'profile picture'} src={profile.images ? profile.images[0] : profPicDefault } sx={{ boxShadow: 4, height: 76, width: 76 }} />

              {/* Profile Overall Stats */}
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Typography  key={'20'}>
                  Sample: {profile.swipes.length > 0 ? profile.swipes.length : 0}
                </Typography>
                <Typography  key={'21'}>
                  Right Swipes: {profile.swipes.length > 0 ? getRightSwipesNumber(profile.swipes) : 0}
                </Typography>
                <Typography  key={'22'}>
                  Percentage: {profile.swipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(profile.swipes), profile.swipes.length) : 0}%
                </Typography>
              </Box>

              <Box key={profile.username} sx={{ height: 76, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                {profile.id === currentProfileId ? 
                  <Typography key={'23'} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Current
                  </Typography>
                  :
                  <Typography key={'24'} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Finished
                  </Typography>
                }

                <Box key={index}>
                  <IconButton
                    key={'26'}
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                  >
                    <MoreHorizOutlinedIcon key={'200'} />
                  </IconButton>
                  <Menu
                    key={'27'}
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        // maxHeight: ITEM_HEIGHT * 4.5,
                        width: '10%',
                      },
                    }}
                  >
                    {profile.id === currentProfileId ? 
                      moreCurrentProfileOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                          {option}
                        </MenuItem>
                      ))
                      : 
                      moreProfileOptions.map((option) => (
                        <MenuItem key={option} onClick={handleClose}>
                          {option}
                        </MenuItem>
                      ))
                    }
                  </Menu>
                </Box>
              </Box>
            </Box>
          )
        })}

        {/* Line at bottom of  */}
        <Divider key={'28'} sx={{ mt: 2 }} />

      </Stack>
    </>
  )
}

export const overallUserAnalyticsHorizontal = (allSwipes) => {

  return (
    <Stack key={'1'} spacing={0}>
      <Box key={'1'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box key={'1'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Sample
          </Typography>
          <Typography key={'2'}>
            {allSwipes.length > 0 ? allSwipes.length : 0}
          </Typography>
        </Box>
        <Box key={'2'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Right Swipes
          </Typography>
          <Typography key={'2'}>
            {allSwipes.length > 0 ? getRightSwipesNumber(allSwipes) : 0}
          </Typography>
        </Box>
        <Box key={'3'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Percentage
          </Typography>
          <Typography key={'2'}>
            {allSwipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(allSwipes), allSwipes.length) : 0}%
          </Typography>
        </Box>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 2 }} />

    </Stack>
  )
}

export const socialMediaMatches = (matchesArray, userId, profileId, isOverall = true) => {
  
  return (
    <Stack key={'10'} spacing={0}>
      <Box key={'10'} sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        <Typography key={'10'} variant='p' sx={{ mt: 1 }} >Social Media Matches: 
          <Typography key={'11'} variant='p' sx={{ ml: 2, fontWeight: 'bold', fontSize: '16px', color: 'primary.main' }} as='span'>
            <Link key={'12'} to={ isOverall ? `/analytics/profile/${userId}/matches` : `/analytics/profile/${userId}/${profileId}/matches`}>
              { getSocialMediaMatches(matchesArray).length }
            </Link>
          </Typography>
        </Typography>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 2 }} />
    </Stack>
  )
}


export const photosFeedback = (imagesWithCommentsArray, isBest = true ) => {
  return (
    <Stack>
      
      <Box key = {'10'} spacing={0} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>

        <Typography key={'9'} variant='p' sx={{ mt: 0 }}>{isBest ? 'Best Photos:' : 'Worst Photos:'}</Typography>
        
        <Box key={'8'} sx={{ width: 300, mt: 2, mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {imagesWithCommentsArray.map((imageWithComments, index) => {
            return (
              <Box key={'1'} sx={{ width: 75, height: 75, display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                <img
                  src={imageWithComments.image !== 'undefined' ? imageWithComments.image : isBest ? noGoodImages : noBadImages}
                  alt={index}
                  value={index}
                  loading='lazy'
                  className={imagesWithCommentsArray.length > 0 ? 'yes-photo' : 'no-photo'}
                  key={`image-${index}`}
                />

                <Box key={'1'} sx={{ textOverflow: 'clip', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[0] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[0]} x ${imageWithComments.frequency[0]}`
                      :
                      '-'
                    }
                  </Typography>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[1] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[1]} x ${imageWithComments.frequency[1]}`
                      :
                      '-'
                    }
                  </Typography>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[2] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[2]} x ${imageWithComments.frequency[2]}`
                      :
                      '-'
                    }
                  </Typography>
                </Box>
              </Box>
            )
          })}
          
          
        </Box>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 8 }} />
    </Stack>
  )
}

export const bioFeedback = (swipes) => {
  
  return (
    <Stack key={'1'} spacing={0}>
      
      <Box key = {'10'} spacing={0} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>

        <Typography key={'9'} variant='p' sx={{ mt: 0 }}>
          Bio:
        </Typography>
      </Box>
      <Box key={'1'} sx={{ mt: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box key={'1'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Good
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(swipes), swipes.length) : 0}%
          </Typography>
        </Box>
        <Box key={'2'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            So-So
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(swipes), swipes.length) : 0}%
          </Typography>
        </Box>
        <Box key={'3'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Bad
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(swipes), swipes.length) : 0}%
          </Typography>
        </Box>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 2 }} />

    </Stack>
  )
}

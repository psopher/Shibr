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


export const getProfilesList = (profilesArray, currentProfileId = 0, open = false, handleMenuOpen, handleClose, anchorEl) => {

  // const [anchorEl, setAnchorEl] = React.useState(null)
  // const open = Boolean(anchorEl)
  // const handleMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget)
  // }
  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  console.log('profiles array -> ', profilesArray)
  console.log('current profile id ->', currentProfileId)
  const profZero = profilesArray[0]
  console.log('profile id ->', profZero.id)

  const getRightSwipesNumber = (swipesArray) => {
    const rightSwipesArray = swipesArray.filter(swipe => swipe.right_swipe)
    return rightSwipesArray.length
  } 
  const getRightSwipesPercent = (sampleSize = 0, rightSwipesNumber = 0) => {
    return (sampleSize / rightSwipesNumber) * 100
  } 

  return (
    <>
      <Stack spacing={0}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {profilesArray.map((profile, index) => {
            return (
              <>
                {/* Profile Picture */}
                <Avatar alt={'profile picture'} src={profile.images ? profile.images[0] : profPicDefault } sx={{ boxShadow: 4, height: 76, width: 76 }} />

                {/* Profile Overall Stats */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Typography>
                    Sample: {profile.swipes.length > 0 ? profile.swipes.length : 0}
                  </Typography>
                  <Typography>
                    Right Swipes: {profile.swipes.length > 0 ? getRightSwipesNumber(profile.swipes) : 0}
                  </Typography>
                  <Typography>
                    Percentage: {profile.swipes.length > 0 ? getRightSwipesPercent(getRightSwipesNumber(profile.swipes), profile.swipes.length) : 0}%
                  </Typography>
                </Box>

                <Box sx={{ height: 76, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  {profile.id === currentProfileId ? 
                    <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Current
                    </Typography>
                    :
                    <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Finished
                    </Typography>
                  }

                  <Box>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                    >
                      <MoreHorizOutlinedIcon />
                    </IconButton>
                    <Menu
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

              </>
            )
          })}
        </Box>

        {/* Line at bottom of  */}
        <Divider sx={{ mt: 2 }} />

      </Stack>
    </>
  )
}

export const overallUserAnalyticsHorizontal = () => {

  return (
    <>
    </>
  )
}

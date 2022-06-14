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
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'
import profPicDefault from '../images/prof-pic-default.png'

import { styled } from '@mui/material/styles'


export const getProfilesList = (profile, isCurrent = false, handleMenuOpen, handleMenuClose) => {

  return (
    <>
    </>
  )
}
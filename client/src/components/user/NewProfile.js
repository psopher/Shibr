
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

import { getUserFromLocalStorage } from '../../helpers/storage.js'

import { newProfileImageList } from '../../helpers/imageHandling'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import { styled } from '@mui/material/styles'


const NewProfile = () => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

  console.log('Input ->', Input)

  const user = getUserFromLocalStorage()
  console.log('user ->', user)

  const currentProfilePhotos = ['', '', '', '', '']
  console.log('current profile photos', currentProfilePhotos)

  if (user) {
    const currentProfile = user.profiles.filter(profile => profile.id === user.currentProfile)
    
    if (currentProfile.images.length > 0) {
      
      const images = currentProfile.images

      for (let i = 0; i < images.length; i++) {
        currentProfilePhotos[i] = images[i]
      }

    }

  }
  
  // console.log('currentProfile ->', currentProfile)

  // Form data passed by user
  const [ photos, setPhotos ] = useState(currentProfilePhotos)
  console.log('photos ->', photos)

  //loading and error state
  const [loading, setLoading] = useState(false)
  // setLoading(false)
  const [errors, setErrors] = useState(false)


  const handeImageSelect = async (e) => {
    console.log('HANDLE IMAGE SELECT RUNS')
  
    const selectedIndex = parseInt(e.target.classList[0].charAt(0))
    console.log('selected index ->', selectedIndex)

    const urlString = URL.createObjectURL(e.target.files[0])

    const img = new Image()
    img.src = urlString

    img.onload = async function() {
      const widthMoreThanHeight = img.width > img.height ? true : false
      const widthOverHeight = img.width / img.height
      let scale
      let startX
      let startY
      let sideLength
      if (widthMoreThanHeight) {
        scale = img.height / 300
        startX = -(img.width - img.height) / 2
        startY = 0
        sideLength = img.height
      } else if (widthOverHeight === 1){
        scale = img.height / 300
        startX = 0
        startY = 0
        sideLength = img.height
      } else {
        scale = img.width / 300
        startX = 0
        startY = -(img.height - img.width) / 2
        sideLength = img.width
      }

      const canvas = document.createElement('canvas')
      canvas.width = sideLength
      canvas.height = sideLength

      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img, //image
        startX,
        startY
      )

      const squareImageURL = canvas.toDataURL('image/jpg', 1)

      const newPhotos = photos
      newPhotos[selectedIndex] = squareImageURL
      // console.log('photos ->', photos)
      // console.log('new photos ->', newPhotos)
      setPhotos([ ...newPhotos ])
    }
  }

  const handleDeleteImage = (e) => {
    console.log('HANDLE DELETE IMAGE RUNS')
    e.stopPropagation()
    // console.log('e.target ->', e.target)
    // console.log('e.target.classList ->', e.target.classList)

    const selectedIndex = parseInt(e.target.classList[2].charAt(0))
    // console.log('selected index ->', selectedIndex)


    const newPhotos = photos
    newPhotos[selectedIndex] = ''
    // console.log('photos ->', photos)
    // console.log('new photos ->', newPhotos)
    setPhotos([ ...newPhotos ])

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('HANDLE SUBMIT RUNS')

    // window.scrollTo(0, 0)
    
    // if (karma < 5) {
    //   setKarma(karma + 1)
    // }

    // setSwiped(false)

  }


  return (
    <>
      {
        loading ?
          <Container key={'container-key-12345'} maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
            <Spinner key={'spinner-key-12345'} />
          </Container >
          : errors ?
            <RequestError key={'error-key-12345'} />
            : 
            <>
              <Container key={'container-key-0'} width='sm' sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper key={'paper-key-0'} elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4 }} >
                  <Typography key={'type-key-0'} variant='h3' sx={{ pb: 2, textAlign: 'center' }}>My Profile</Typography>
                  <Box
                    key={'box-key-0'}
                    component='form'
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                    onSubmit={handleSubmit}
                  >



                    {/* This must be first input So that the file upload only fires when you press the button */}
                    <>
                      <Input key={'input-0'} type="text" autoFocus="autoFocus" />
                    </>
                    
                    {/* Images */}
                    {newProfileImageList(photos, handeImageSelect, handleDeleteImage)}



                    {/* Submit Button */}
                    <Grid key={'grid-key-0'} container textAlign='center'>
                      <Grid key={'grid-key-1'} item xs={12}>
                        <Button key={'button-0'} variant="contained" type="submit"  sx={{ width: .5, mt: 4 }}>Create</Button>
                      </Grid>
                    </Grid>

                  </Box>
                </Paper>
              </Container >
            </>
      }
    </>
  )
}

export default NewProfile
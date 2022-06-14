
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

import { getUserFromLocalStorage } from '../../helpers/storage.js'

import { newProfileImageList } from '../../helpers/imageHandling'

import { genders } from '../../helpers/formOptions'

import { handleAgeChange } from '../../helpers/formMethods'

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
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'

import { styled } from '@mui/material/styles'


const NewProfile = () => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

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

  const [ age, setAge ] = useState(10)
  const [ gender, setGender ] = useState('')

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
              <Container key={'container-key-0'} width='sm' sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
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

                    {/* Name */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        id='name'
                        label='Name'
                        variant='outlined'
                        name='name'
                        placeholder='Name * (max 50 characters)'
                        inputProps={{ maxLength: 500 }}
                        // value={formData.name}
                        required
                        // onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                        sx={{ width: '85%' }} 
                      />
                    </Box>

                    {/* Age */}
                    <Typography id="height-slider" gutterBottom sx={{ pl: '10%', mt: 2 }}>
                      Age: {age}
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 0, mb: 2 }}>
                      <Slider
                        value={age}
                        onChange={(e) => handleAgeChange(e, setAge, age)}
                        valueLabelDisplay="auto"
                        name='age'
                        size="small"
                        min={0}
                        max={20}
                        // marks
                        step={1}
                        sx={{ width: '80%', align: 'center' }}
                      />
                    </Box>

                    {/* Gender */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <FormControl required sx={{ width: '85%' }}>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          id="gender"
                          name='gender'
                          value={gender}
                          label='gender'
                          required
                          onChange={e => setGender(e.target.value) }
                        >
                          {genders.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>


                    {/* Training */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        id='training'
                        label='Training'
                        variant='outlined'
                        name='training'
                        placeholder='Training * (max 100 characters)'
                        inputProps={{ maxLength: 100 }}
                        // value={formData.name}
                        // required
                        // onChange={(e) => handleChange(e, setPutErrors, setFormData, formData)}
                        sx={{ width: '85%' }} 
                      />
                    </Box>


                    {/* Bio Title */}
                    {/* <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', mt: 0 }}>
                      <Typography variant='h6' sx={{ pb: 0, pl: '7.5%' }}>Bio</Typography>
                    </Box> */}


                    {/* Bio Textfield */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                      <TextField
                        id='bio'
                        label='Bio'
                        placeholder='Bio * (max 500 characters)'
                        variant='outlined'
                        name='bio'
                        inputProps={{ maxLength: 500 }}
                        // value={formData.bio}
                        required
                        multiline
                        minRows={4}
                        maxRows={6}
                        // onChange={handleChange}
                        sx={{ width: '85%' }}
                        // fullWidth 
                      />
                    </Box>

                    {/* Submit Button */}
                    <Grid key={'grid-key-0'} container textAlign='center'>
                      <Grid key={'grid-key-1'} item xs={12}>
                        <Button key={'button-0'} variant="contained" type="submit"  sx={{ width: .5, mt: 4, mb: 2 }}>Create</Button>
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

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

import { getUserFromLocalStorage, getCurrentProfFromLocalStorage, setCurrentProfToLocalStorage, setProfPicToLocalStorage } from '../../helpers/storage.js'
import { getTokenFromLocalStorage, getPayload } from '../../helpers/auth'

import { newProfileImageList } from '../../helpers/imageHandling'

import { genders } from '../../helpers/formOptions'

import { handleChange } from '../../helpers/formMethods'

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

  // UseNavigate
  const navigate = useNavigate()
  const { userId } = useParams()
  const payload = getPayload()
  console.log('payload.sub is ->', payload.sub)


  const cp = getCurrentProfFromLocalStorage()
  // console.log('cp ->', cp)

  const form = {
    name: '',
    age: 10,
    gender: '',
    school: '',
    bio: '',
    images: ['', '', '', '', ''],
    owner: payload.sub,
  }

  if (cp) {
    if (cp.images.length > 0) {
      const images = cp.images
      for (let i = 0; i < images.length; i++) {
        form.images[i] = images[i]
      }
    }
    if (cp.name.length > 0) {
      form.name = cp.name
    }
    if (cp.age.length > 0) {
      form.age = cp.age
    }
    if (cp.gender.length > 0) {
      form.gender = cp.gender
    }
    if (cp.school.length > 0) {
      form.school = cp.school
    }
    if (cp.bio.length > 0) {
      form.bio = cp.bio
    }
  } 

  // Form Data
  const [ formData, setFormData ] = useState(form)

  // Cloudinary URL and Preset
  const uploadURL = process.env.REACT_APP_CLOUDINARY_URL
  const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

  //loading and error state
  const [loading, setLoading] = useState(false)
  // setLoading(false)
  const [errors, setErrors] = useState(false)
  const [postErrors, setPostErrors] = useState(false)


  const handeImageSelect = async (e) => {
    console.log('HANDLE IMAGE SELECT RUNS')
    setPostErrors(false)
  
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

      const newPhotos = formData.images
      newPhotos[selectedIndex] = squareImageURL
      setFormData({ ...formData, images: [ ...newPhotos ] })
    }
  }

  const handleDeleteImage = (e) => {
    console.log('HANDLE DELETE IMAGE RUNS')
    e.stopPropagation()
    setPostErrors(false)
    // console.log('e.target ->', e.target)
    // console.log('e.target.classList ->', e.target.classList)

    const selectedIndex = parseInt(e.target.classList[2].charAt(0))
    // console.log('selected index ->', selectedIndex)


    const newPhotos = formData.photos
    newPhotos[selectedIndex] = ''

    setFormData({ ...formData, images: [ ...newPhotos ] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('HANDLE SUBMIT RUNS')
    // console.log('form data is ->', formData)
    setLoading(true)
    setErrors(false)
    setPostErrors(false)

    if (formData.images[0] === '') {
      setPostErrors(true)
    } else {

      // Create a new form so that you can pass up the Cloudinary URL
      let newForm = { ...formData }
      // console.log('newForm pre Cloudinary ->', newForm)

      // Upload images to Cloudinary and wait for the response
      const cloudinaryImageLinks = []
      for (let i = 0; i < formData.images.length; i++) {
        if (formData.images[i] !== '') {
          const data = new FormData()
          data.append('file', formData.images[i])
          data.append('upload_preset', preset)
          const res = await axios.post(uploadURL, data)

          cloudinaryImageLinks.push(res.data.url)
        }
      }
      newForm = { ...newForm, images: cloudinaryImageLinks }
      // console.log('newForm post Cloudinary ->', newForm)

      // POST Profile
      try {
        const response = await axios.post('/api/profiles/', newForm, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        console.log(response)
        const createdProfileId = response.data.id
        // console.log('created profile id', createdProfileId)


        // Modify User (current profile, profile picture)
        
        const modificationsObj = {
          'current_profile': createdProfileId,
          'profile_image': newForm.images[0],
          'username': payload.username,
          'email': payload.email,
          'password': payload.pass,
          'password_confirmation': payload.pass,
        }
        // console.log('modifications object ->', modificationsObj)

        try {
          const putResponse = await axios.put(`/api/auth/users/${payload.sub}/`, modificationsObj, {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`,
            },
          })
          
          // console.log('PUT response ->', putResponse)

        } catch (error) {

          setLoading(false)
          console.log(error)
          setPostErrors(true)
        }
        


      } catch (error) {
        setLoading(false)
        console.log(error)

        // error message posting new profile
        setPostErrors(true)
      }


      // update local storage
      window.localStorage.removeItem('currentProf')
      setCurrentProfToLocalStorage(newForm)

      window.localStorage.removeItem('profPic')
      setProfPicToLocalStorage(newForm.images[0])


      // Navigate to: UserAccount
      setLoading(false)
      navigate(`/account/${payload.sub}`)


    }

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
                <Paper key={'paper-key-0'} elevation={6} sx={{ borderRadius: 5,m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4 }} >
                  <Typography key={'type-key-0'} variant='h3' sx={{ pb: 2, textAlign: 'center' }}>My Profile</Typography>
                  <Box
                    key={'box-key-0'}
                    component='form'
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      borderRadius: 5,
                    }}
                    onSubmit={handleSubmit}
                  >

                    {/* This must be first input So that the file upload only fires when you press the button */}
                    <>
                      <Input key={'input-0'} type="text" autoFocus="autoFocus" />
                    </>
                    
                    {/* Images */}
                    {newProfileImageList(formData.images, handeImageSelect, handleDeleteImage)}

                    {/* Name */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        id='name'
                        label='Name'
                        variant='outlined'
                        name='name'
                        placeholder='Name * (max 50 characters)'
                        inputProps={{ maxLength: 50 }}
                        value={formData.name}
                        required
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                        sx={{ width: '85%' }} 
                      />
                    </Box>

                    {/* Age */}
                    <Typography id="height-slider" gutterBottom sx={{ pl: '10%', mt: 2 }}>
                      Age: {formData.age}
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 0, mb: 2 }}>
                      <Slider
                        value={formData.age}
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
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
                          value={formData.gender}
                          label='gender'
                          required
                          onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                        >
                          {genders.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>


                    {/* Training */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        id='school'
                        label='Training'
                        variant='outlined'
                        name='school'
                        placeholder='Training * (max 150 characters)'
                        inputProps={{ maxLength: 150 }}
                        value={formData.school}
                        required
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
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
                        value={formData.bio}
                        required
                        multiline
                        minRows={4}
                        maxRows={6}
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
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

                  {/* Error message if the post request fails */}
                  {postErrors && 
                    <Grid key={'grid-key-564'} container textAlign='center'>
                      <Grid key={'grid-key-657'} item xs={12}>
                        <Typography sx={{ width: '100%', color: 'red' }}>Error. Failed to upload profile.</Typography>
                      </Grid>
                      <Grid key={'grid-key-65237'} item xs={12}>
                        <Typography sx={{ width: '100%', color: 'red' }}>At least one image is required.</Typography>
                      </Grid>
                    </Grid>
                  }
                </Paper>
              </Container >
            </>
      }
    </>
  )
}

export default NewProfile
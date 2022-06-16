
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

import { getPayload, getTokenFromLocalStorage } from '../../helpers/auth'
import { getUserFromLocalStorage, getSettingsFromLocalStorage, setSettingsToLocalStorage } from '../../helpers/storage.js'

import { handleChange } from '../../helpers/formMethods'

import { newProfileImageList } from '../../helpers/imageHandling'

import { interestedIn } from '../../helpers/formOptions'

import { handleAgeRangeChange } from '../../helpers/formMethods'

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
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'

import { styled } from '@mui/material/styles'

const Settings = () => {

  // Styling Input so it won't display
  const Input = styled('input')({
    display: 'none',
  })

  // UseNavigate
  const navigate = useNavigate()
  const { userId } = useParams()
  const payload = getPayload()
  // console.log('payload.sub is ->', payload.sub)

  const user = getUserFromLocalStorage()
  // console.log('user ->', user)
  const settings = getSettingsFromLocalStorage()
  // console.log('settings ->', settings)

  const form = {
    interested_in: '',
    min_age: 0,
    max_age: 20,
    show_me: true,
    give_social: false,
    ig: '',
    sc: '',
    tw: '',
  }

  if (settings) {
    if (settings.interested_in.length > 0) {
      form.interested_in = settings.interested_in
    }
    if (settings.min_age.length > 0 && settings.min_age > -1) {
      form.min_age = settings.min_age
    }
    if (settings.max_age.length > 0 && settings.max_age < 21) {
      form.max_age = settings.max_age
    }
    if (settings.show_me.length > 0) {
      form.show_me = settings.show_me
    }
    if (settings.give_social.length > 0) {
      form.give_social = settings.give_social
    }
    if (settings.ig.length > 0) {
      form.ig = settings.ig
    }
    if (settings.sc.length > 0) {
      form.sc = settings.sc
    }
    if (settings.tw.length > 0) {
      form.tw = settings.tw
    }
  } 

  // Form Data
  const [ formData, setFormData ] = useState(form)

  //loading and error state
  const [loading, setLoading] = useState(false)
  // setLoading(false)
  const [errors, setErrors] = useState(false)
  const [postErrors, setPostErrors] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('HANDLE SUBMIT RUNS')
    // console.log('form data is ->', formData)
    setLoading(true)
    setErrors(false)
    setPostErrors(false)

    // POST Settings to User
        
    const newForm = {
      ...formData,
      'username': payload.username,
      'email': payload.email,
      'password': payload.pass,
      'password_confirmation': payload.pass,
    }

    try {
      const putResponse = await axios.put(`/api/auth/users/${payload.sub}/`, newForm, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      
      console.log('PUT response ->', putResponse)

    } catch (error) {

      setLoading(false)
      console.log(error)
      setPostErrors(true)
    }


    // update local storage
    window.localStorage.removeItem('settings')
    setSettingsToLocalStorage(formData)


    // Navigate to: UserAccount
    setLoading(false)
    navigate(`/account/${payload.sub}`)

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
                <Paper key={'paper-key-0'} elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 6, pr: 6 }} >
                  <Typography key={'type-key-0'} variant='h3' sx={{ pb: 2, textAlign: 'center' }}>My Settings</Typography>
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

                    {/* Interested In */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 1 }}>
                      <FormControl required sx={{ width: '100%' }}>
                        <InputLabel id="interested-in-label">Interested In</InputLabel>
                        <Select
                          labelId="interested-in-label"
                          id="interested-in"
                          name='interested_in'
                          value={formData.interested_in}
                          label='Interested In'
                          required
                          onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                          // onChange={e => setGender(e.target.value) }
                        >
                          {interestedIn.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>


                    {/* Age Range */}
                    <Typography id="height-slider" gutterBottom sx={{ pl: '3%', mt: 3 }}>
                      Age: {formData.min_age} - {formData.max_age}
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 0 }}>
                      <Slider
                        value={[formData.min_age, formData.max_age]}
                        onChange={(e) => handleAgeRangeChange(e, setPostErrors, setFormData, formData)}
                        valueLabelDisplay="auto"
                        name='age-range'
                        size="small"
                        min={0}
                        max={20}
                        // marks
                        step={1}
                        sx={{ width: '90%', align: 'center' }}
                      />
                    </Box>


                    {/* Show Me on Shibr */}
                    <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Typography variant='p' sx={{ ml: 1, mr: 3 }}>Show me on Shibr</Typography>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            value={formData.show_me} 
                            name='show_me'
                            checked={formData.show_me}
                            onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                            sx={{ pl: 0 }} />
                        } 
                        // label="Show me on Shibr"
                        // labelPlacement="start"
                      />
                    </Box>


                    {/* Give Social Media to Matches */}
                    <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
                      <Typography variant='p' sx={{ ml: 1, mr: 3 }}>Give Social Media to Matches</Typography>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            value={formData.give_social} 
                            name='give_social'
                            checked={formData.give_social}
                            onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                            sx={{ pl: 0 }} />
                        } 
                        // label="Show me on Shibr"
                        // labelPlacement="start"
                      />
                    </Box>


                    {/* Social Media */}
                    {/* Instagram */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        label="Instagram"
                        id="outlined-start-adornment"
                        sx={{ m: 0, width: '95%' }}
                        InputProps={{
                          maxLength: 100,
                          startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        }}
                        name='ig'
                        value={formData.ig}
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                      />
                    </Box>

                    {/* Snapchat */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        label="SnapChat"
                        id="outlined-start-adornment"
                        sx={{ m: 0, width: '95%' }}
                        InputProps={{
                          maxLength: 100,
                          startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        }}
                        name='sc'
                        value={formData.sc}
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                      />
                    </Box>

                    {/* Twitter */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                      <TextField
                        label="Twitter"
                        id="outlined-start-adornment"
                        sx={{ m: 0, width: '95%' }}
                        InputProps={{
                          maxLength: 100,
                          startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        }}
                        name='tw'
                        value={formData.tw}
                        onChange={(e) => handleChange(e, setPostErrors, setFormData, formData)}
                      />
                    </Box>

                    {/* Submit Button */}
                    <Grid key={'grid-key-0'} container textAlign='center'>
                      <Grid key={'grid-key-1'} item xs={12}>
                        <Button key={'button-0'} variant="contained" type="submit"  sx={{ width: .5, mt: 4, mb: 2 }}>Submit</Button>
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

export default Settings
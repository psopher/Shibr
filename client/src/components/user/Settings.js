
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

import { getUserFromLocalStorage } from '../../helpers/storage.js'

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

  const user = getUserFromLocalStorage()
  console.log('user ->', user)

  const [ ageRange, setAgeRange ] = useState([0, 20])
  const [ gender, setGender ] = useState('')
  const [showMe, setShowMe] = useState(true)
  const [giveSocial, setGiveSocial] = useState(false)

  //loading and error state
  const [loading, setLoading] = useState(false)
  // setLoading(false)
  const [errors, setErrors] = useState(false)

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
                          name='interested-in'
                          value={interestedIn}
                          label='Interested In'
                          required
                          onChange={e => setGender(e.target.value) }
                        >
                          {interestedIn.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>


                    {/* Age Range */}
                    <Typography id="height-slider" gutterBottom sx={{ pl: '3%', mt: 3 }}>
                      Age: {ageRange[0]} - {ageRange[1]}
                    </Typography>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 0 }}>
                      <Slider
                        value={ageRange}
                        onChange={(e) => handleAgeRangeChange(e, setAgeRange, ageRange)}
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
                          <Checkbox value={showMe} onChange={e => setShowMe(!showMe)} sx={{ pl: 0 }} />
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
                          <Checkbox value={giveSocial} onChange={e => setShowMe(!giveSocial)} sx={{ pl: 0 }} />
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
                      />
                    </Box>

                    {/* Submit Button */}
                    <Grid key={'grid-key-0'} container textAlign='center'>
                      <Grid key={'grid-key-1'} item xs={12}>
                        <Button key={'button-0'} variant="contained" type="submit"  sx={{ width: .5, mt: 4, mb: 2 }}>Submit</Button>
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

export default Settings
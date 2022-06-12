import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from './utilities/Spinner.js'
import RequestError from './common/RequestError'
import { getImageList } from '../helpers/imageHandling'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

// icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'


import { getUserFromLocalStorage } from '../helpers/storage'


const Home = () => {

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //profile state 
  const [profiles, setProfiles] = useState([])

  const user = getUserFromLocalStorage()
  console.log('user is: ', user)
  // const startKarma = user ? user.karma : 0
  // console.log('start karma ->', startKarma)
  const [karma, setKarma] = useState(user ? user.karma : 0)

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/profiles/')
        setProfiles(data)
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleLeftSwipe = (e) => {
    console.log('HANDLE LEFT SWIPE RUNS')
    
    if (karma < 5) {
      setKarma(karma + 1)
    }
  }

  const handleRightSwipe = (e) => {
    console.log('HANDLE RIGHT SWIPE RUNS')
    
    if (karma < 5) {
      setKarma(karma + 1)
    }
  }

  return (
    <>
      {
        loading ?
          <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
            <Spinner />
          </Container >
          : errors ?
            <RequestError />
            :
            // images
            <>
              <Container sx={{ pb: 4 }}>
                <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 4, mt: 2 }}>
                  {/* Image List */}
                  {getImageList(profiles[0], 1, 1, 1, 4, true)}

                  {/* Progress Bar */}
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <LinearProgress variant="determinate" value={karma * 20} sx={{ width: 200, height: 10, border: 1, boxShadow: 4 }} />
                  </Box>


                  {/* Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 3, mb: 4 }}>
                    <Box onClick={handleLeftSwipe} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
                      <IconButton aria-label="swipe-left" size="large" sx={{ color: 'red' }} >
                        <CloseOutlinedIcon fontSize="large" />
                      </IconButton>
                    </Box>
                    <Box onClick={handleRightSwipe} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
                      <IconButton aria-label="swipe-right" size="large" sx={{ color: 'green' }} >
                        <FavoriteOutlinedIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </Box>
                </Container >
              </Container>
            </>

      }
    </>
  )
}

export default Home
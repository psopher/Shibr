import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Spinner from './utilities/Spinner.js'
import RequestError from './common/RequestError'
import { getProfile, profileBio } from '../helpers/viewProfile'
import { goodPhotoFeedback, badPhotoFeedback, feedbackTypes, overallBioFeedback, goodBioFeedback, badBioFeedback } from '../helpers/formOptions'
import { photoFeedback, bioFeedback } from '../helpers/formMethods'
import { getFeedbackImageList } from '../helpers/imageHandling.js'

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
  const [swiped, setSwiped] = useState(false)
  const [isRightSwipe, setIsRightSwipe] = useState(false)

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

  const handeImageSelect = (e) => {
    e.stopPropagation()
    // console.log('e.target ->', e.target)
    // console.log('e.target.classList ->', e.target.classList)

    const selectedIndex = parseInt(e.target.alt)
    console.log('selected index ->', selectedIndex)

    const photoClass = e.target.classList
    // console.log('photo class ->', photoClass)
    // console.log('photo class index 0 ->', photoClass[0])

    const photos = document.body.querySelectorAll(`.${photoClass[0]}`)
    console.log('photos ->', photos)
    photos.forEach(photo => photo.classList.remove('styled'))

    e.target.classList.toggle('styled')
  }

  const handlePhotoFeedbackSelect = (e) => {
    console.log('handleFeedbackSelect Fires')
    console.log('e.targe.textContent ->', e.target.textContent)
    const feedbackClass = e.target.classList
    // console.log('feedback class ->', feedbackClass)
    // console.log('feedback class index 0 ->', feedbackClass[0])

    // const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}`)
    // console.log('feedback ->', feedback)
    // feedback.forEach(comment => comment.classList.remove('styled'))

    e.target.classList.toggle('styled')

  }

  const handleBioFeedbackSelect = (e) => {
    console.log('handleBioFeedbackSelect Runs')
    console.log('e.targe.textContent ->', e.target.textContent)
    const feedbackClass = e.target.classList

    if (e.target.textContent === 'I Like Nothing' || e.target.textContent === 'I Like Everything') {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    } else {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}-end`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    }

    // console.log('feedback class ->', feedbackClass)
    // console.log('feedback class index 0 ->', feedbackClass[0])

    // const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}`)
    // console.log('feedback ->', feedback)
    // feedback.forEach(comment => comment.classList.remove('styled'))

    e.target.classList.toggle('styled')
  }

  const handleLeftSwipe = (e) => {
    console.log('HANDLE LEFT SWIPE RUNS')
    window.scrollTo(0, 0)

    setSwiped(true)
  }

  const handleRightSwipe = (e) => {
    console.log('HANDLE RIGHT SWIPE RUNS')
    window.scrollTo(0, 0)

    setIsRightSwipe(true)
    setSwiped(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    
    if (karma < 5) {
      setKarma(karma + 1)
    }

    setSwiped(false)

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
            : swiped ? 
              // Feedback View
              <>
                <Container width='sm' sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4 }} >
                    <Typography variant='h3' sx={{ pb: 2, textAlign: 'center' }}>My Inulysis</Typography>
                    <Box
                      component='form'
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                      onSubmit={handleSubmit}
                    >
                      {/* Photos */}
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Typography variant='h5' sx={{ pb: 0, textAlign: 'center' }}>Photos</Typography>
                      </Box>

                      {/* Best Images */}
                      {getFeedbackImageList(profiles[0], 1, handeImageSelect)}

                      {/* Good Image Feedback */}
                      {photoFeedback(goodPhotoFeedback, 1, handlePhotoFeedbackSelect)}

                      {/* Worst Images */}
                      {getFeedbackImageList(profiles[0], 0, handeImageSelect)}

                      {/* Bad Image Feedback */}
                      {photoFeedback(badPhotoFeedback, 0, handlePhotoFeedbackSelect)}
                      
                      
                      {/* Bio */}
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                        <Typography variant='h5' sx={{ pb: 0, textAlign: 'center' }}>Bio</Typography>
                      </Box>

                      {/* Profile Bio */}
                      {profileBio(profiles[0], 1)}

                      {/* Overall Bio Feedback */}
                      {bioFeedback(overallBioFeedback, feedbackTypes[0], handleBioFeedbackSelect)}

                      {/* Good Bio Feedback */}
                      {bioFeedback(goodBioFeedback, feedbackTypes[1], handleBioFeedbackSelect)}

                      {/* Bad Bio Feedback */}
                      {bioFeedback(badBioFeedback, feedbackTypes[2], handleBioFeedbackSelect)}

                      {/* Submit Button */}
                      <Grid container textAlign='center'>
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit"  sx={{ width: .5, mt: 4 }}>Submit</Button>
                        </Grid>
                      </Grid>

                    </Box>
                  </Paper>
                </Container >
              </>
              :
              // Swipe View
              <>
                <Container maxWidth='xs' sx={{ pb: 4, pt: 4 }}>
                  {/* <Container > */}
                  <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'cream', boxShadow: 4, borderRadius: 4 }} >
                    {/* Image List */}
                    {getProfile(profiles[0], karma, true, handleLeftSwipe, handleRightSwipe)}
                  </Paper>
                </Container>
              </>

      }
    </>
  )
}

export default Home
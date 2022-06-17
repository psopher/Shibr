import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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


import { setCurrentProfToLocalStorage, setProfPicToLocalStorage, setSettingsToLocalStorage } from '../helpers/storage'
import { getPayload, userIsAuthenticated, getTokenFromLocalStorage } from '../helpers/auth.js'


const Home = () => {

  // Navigate
  const navigate = useNavigate()
  
  const payload = getPayload()
  // console.log('payload sub ->', payload.sub)


  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)
  const [postErrors, setPostErrors] = useState(false)

  //profile state 
  const [profiles, setProfiles] = useState([])
  const [iterator, setIterator] = useState(0)
  const [swiped, setSwiped] = useState(false)
  const [isRightSwipe, setIsRightSwipe] = useState(false)
  const [user, setUser] = useState({})
  const [currentProfile, setCurrentProfile] = useState({})
  const [settings, setSettings] = useState({})
  const [feedbackForm, setFeedbackForm] = useState({
    'best_image_index': -1,
    'best_image_comments': [],
    'worst_image_index': -1,
    'worst_image_comments': [],
    'bio_overall': '',
    'bio_good_comments': [],
    'bio_bad_comments': [],
    'swipe_id': -1,
  })
  const [karma, setKarma] = useState(0)

  const settingsAndUserToLocalStorage = (retrievedUser) => {
    
    const settingsObj = {
      interested_in: '',
      min_age: 0,
      max_age: 20,
      show_me: true,
      give_social: false,
      ig: '',
      sc: '',
      tw: '',
    }

    if (retrievedUser) {
      console.log('retrieved user ->', retrievedUser)
      if (retrievedUser.interested_in.length > 0) {
        settingsObj.interested_in = retrievedUser.interested_in
      }
      if (retrievedUser.min_age > -1) {
        settingsObj.min_age = retrievedUser.min_age
      }
      if (retrievedUser.max_age < 21) {
        settingsObj.max_age = retrievedUser.max_age
      }
      if (retrievedUser.show_me === false) {
        settingsObj.show_me = retrievedUser.show_me
      }
      if (retrievedUser.give_social === true) {

        settingsObj.give_social = retrievedUser.give_social
      }
      if (retrievedUser.ig.length > 0) {
        settingsObj.ig = retrievedUser.ig
      }
      if (retrievedUser.sc.length > 0) {
        settingsObj.sc = retrievedUser.sc
      }
      if (retrievedUser.tw.length > 0) {
        settingsObj.tw = retrievedUser.tw
      }
    } 
    console.log('settings object ->', settingsObj)

    setSettings(settingsObj)

    window.localStorage.removeItem('settings')
    setSettingsToLocalStorage(settingsObj)

    return settingsObj
  }

  const sortProfiles = (profiles, retrievedUser) => {
    console.log('SORT PROFILES RUNS')

    const swipedProfileIdsArray = []
    for (let i = 0; i < retrievedUser.swipes.length; i++ ) {
      // if (retrievedUser.swipes[i].swiped_profile_id.id === profile.id) {
      swipedProfileIdsArray.push(retrievedUser.swipes[i].swiped_profile_id.id)
      // }
    }
    console.log('swiped profile ids array ->', swipedProfileIdsArray)

    const profileAfterFilters = profiles.filter((profile) => {

      return (
        profile.owner.id !== retrievedUser.id 
        && profile.age >= retrievedUser.min_age 
        && profile.age <= retrievedUser.max_age 
        && (retrievedUser.interested_in === 'Alphas' ? profile.gender === 'Male' : retrievedUser.interested_in === 'Bitches' ? profile.gender === 'Female' : (profile.gender === 'Male' || profile.gender === 'Female')) 
        && !swipedProfileIdsArray.includes(profile.id)
      ) 
    })



    return profileAfterFilters
  }

  const findCurrentProfile = (profiles, retrievedUser) => {
    console.log('FIND CURRENT PROFILE RUNS')

    const current = profiles.filter(profile => profile.id === retrievedUser.current_profile)

    return current
  }

  useEffect(() => {

    // User must have an account to view profiles
    if (!userIsAuthenticated()) {
      navigate('/login')
    }

    const getData = async () => {
      try {
        // Get data for specified user, by username
        const response = await axios.get(`/api/auth/users/${payload.sub}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        console.log('data is ->', response.data)
        const retrievedUser = response.data
        setUser(retrievedUser)
        setKarma(retrievedUser.karma)


        const settingsObj = settingsAndUserToLocalStorage(retrievedUser)

        try {
          const { data } = await axios.get('/api/profiles/')

          console.log('retrieved profiles ->', data)

          const currentProfile = findCurrentProfile(data, retrievedUser)
          console.log(currentProfile)
          setCurrentProfile(currentProfile)

          window.localStorage.removeItem('currentProf')
          setCurrentProfToLocalStorage(currentProfile)

          console.log('current profile images ->', currentProfile[0].images[0])

          window.localStorage.removeItem('profPic')
          setProfPicToLocalStorage(currentProfile[0].images[0])

          const sortedProfiles = sortProfiles(data, retrievedUser)
          console.log('sorted profiles ->', sortedProfiles)
          setProfiles(sortedProfiles)
        } catch (error) {
          console.log(error)
          setErrors(true)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleImageSelect = (e, bestPhotos) => {
    e.stopPropagation()

    setPostErrors(false)

    // console.log('e.target ->', e.target)
    // console.log('e.target.classList ->', e.target.classList)

    const selectedIndex = parseInt(e.target.alt)
    console.log('selected index ->', selectedIndex)

    const photoClass = e.target.classList

    const photos = document.body.querySelectorAll(`.${photoClass[0]}`)
    console.log('photos ->', photos)
    photos.forEach(photo => photo.classList.remove('styled'))

    console.log('bestPhotos ->', bestPhotos)

    if (bestPhotos) {
      console.log('best photos runs')
      setFeedbackForm({ ...feedbackForm, 'best_image_index': selectedIndex })
    } else {
      console.log('worst photos runs')
      setFeedbackForm({ ...feedbackForm, 'worst_image_index': selectedIndex })
    }

    e.target.classList.toggle('styled')


  }

  const handlePhotoFeedbackSelect = (e, isGoodFeedback) => {
    console.log('handleFeedbackSelect Fires')

    setPostErrors(false)

    console.log('e.targe.textContent ->', e.target.textContent)
    const feedbackClass = e.target.classList
    console.log('feedback class ->', feedbackClass)
    console.log('feedback class index 0 ->', feedbackClass[0])
    console.log('isGoodFeedback ->', isGoodFeedback)

    if (e.target.textContent === 'No Good Images' || e.target.textContent === 'No Bad Images') {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    } else {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}-end`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    }

    if (isGoodFeedback) {
      console.log('is good photo feedback!')
      if (e.target.textContent === 'No Good Images' || feedbackForm.best_image_comments.includes('No Good Images')) {
        setFeedbackForm({ ...feedbackForm, 'best_image_comments': [e.target.textContent] })
      } else {
        setFeedbackForm({ ...feedbackForm, 'best_image_comments': [ ...feedbackForm.best_image_comments, e.target.textContent ] })  
      }
    } else {
      console.log('is bad photo feedback!')
      if (e.target.textContent === 'No Bad Images' || feedbackForm.worst_image_comments.includes('No Bad Images')) {
        setFeedbackForm({ ...feedbackForm, 'worst_image_comments': [e.target.textContent] })
      } else {
        setFeedbackForm({ ...feedbackForm, 'worst_image_comments': [ ...feedbackForm.worst_image_comments, e.target.textContent ] })
      }
    }



    e.target.classList.toggle('styled')

  }

  const handleBioFeedbackSelect = (e, feedbackType) => {
    console.log('handleBioFeedbackSelect Runs')

    setPostErrors(false)

    console.log('e.targe.textContent ->', e.target.textContent)
    console.log('feedbackType is ->', feedbackType)
    const feedbackClass = e.target.classList

    if (e.target.textContent === 'I Like Nothing' || e.target.textContent === 'I Like Everything' || e.target.textContent === 'Good' || e.target.textContent === 'So-So' || e.target.textContent === 'Bad' ) {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    } else {
      const feedback = document.body.querySelectorAll(`.${feedbackClass[0]}-end`)
      console.log('feedback ->', feedback)
      feedback.forEach(comment => comment.classList.remove('styled'))
    }

    if (feedbackType === 'Overall') {
      console.log('is overall bio!')
      setFeedbackForm({ ...feedbackForm, 'bio_overall': e.target.textContent })
    } else if (feedbackType === 'Good') {
      console.log('is good bio!')
      if (e.target.textContent === 'I Like Nothing' || feedbackForm.bio_good_comments.includes('I Like Nothing')) {
        setFeedbackForm({ ...feedbackForm, 'bio_good_comments': [e.target.textContent] })
      } else {
        setFeedbackForm({ ...feedbackForm, 'bio_good_comments': [ ...feedbackForm.bio_good_comments, e.target.textContent ] })
      }
    } else if (feedbackType === 'Bad') {
      console.log('is bad bio!')
      if (e.target.textContent === 'I Like Everything' || feedbackForm.bio_bad_comments.includes('I Like Everything')) {
        setFeedbackForm({ ...feedbackForm, 'bio_bad_comments': [e.target.textContent] })
      } else {
        setFeedbackForm({ ...feedbackForm, 'bio_bad_comments': [ ...feedbackForm.bio_bad_comments, e.target.textContent ] })
      }
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
    if (!userIsAuthenticated()) {
      navigate('/login')
    }
    if (!currentProfile) {
      navigate(`/account/${payload.sub}/new-profile`)
    }

    setSwiped(true)
  }

  const handleRightSwipe = (e) => {
    console.log('HANDLE RIGHT SWIPE RUNS')
    window.scrollTo(0, 0)
    if (!userIsAuthenticated()) {
      navigate('/login')
    }
    if (!currentProfile) {
      navigate(`/account/${payload.sub}/new-profile`)
    }

    setIsRightSwipe(true)
    setSwiped(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    setPostErrors(false)

    // console.log('feedback form data ->', feedbackForm)

    if (feedbackForm.best_image_index > -1 
      && feedbackForm.worst_image_index > -1 
      && feedbackForm.best_image_comments.length > 0 
      && feedbackForm.worst_image_comments.length > 0 
      && feedbackForm.bio_good_comments.length > 0 
      && feedbackForm.bio_bad_comments.length > 0 
      && feedbackForm.bio_overall !== '') {

      // console.log('all feedback filled out')
  
      const swipeObj = {
        'swiper_id': user.id,
        'swiped_profile_id': profiles[iterator].id,
        'right_swipe': isRightSwipe,
      }

      // console.log('swipe object ->', swipeObj)

      // Post Swipe
      // After receiving the swipe Id, post feedback


      // Create a new form so that you can pass swipe id
      const newForm = { ...feedbackForm }
      // console.log('new form ->', newForm)

      // POST Profile
      try {
        setLoading(true)

        const response = await axios.post('/api/swipes/', swipeObj, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        console.log(response)
        const createdSwipeId = response.data.id
        console.log('created swipe id', createdSwipeId)

        // Add swipe id to form
        newForm.swipe_id = createdSwipeId
        console.log('new form with created swipe id ->', createdSwipeId)

        try {
          const feedbackResponse = await axios.post('/api/feedback/', newForm, {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`,
            },
          })
          
          console.log('POST feedback response ->', feedbackResponse)



          // Update Karma for user account
          console.log('karma ->', karma)
          if (karma < 5) {
            console.log('this runs')

          
            const modificationsObj = {
              'karma': karma + 1,
            }
            try {
              const putResponse = await axios.put(`/api/auth/users/${payload.sub}/`, modificationsObj, {
                headers: {
                  Authorization: `Bearer ${getTokenFromLocalStorage()}`,
                },
              })
              console.log('PUT response ->', putResponse)
              setKarma(karma + 1)

            } catch (error) {

              setLoading(false)
              console.log(error)
              setPostErrors(true)
            }
          }



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



      setSwiped(false)

      setIterator(iterator + 1)

      setLoading(false)

    } else {

      console.log('all feedback NOT filled out')

      setPostErrors(true)
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
                      {getFeedbackImageList(profiles[iterator], 1, handleImageSelect)}

                      {/* Good Image Feedback */}
                      {photoFeedback(goodPhotoFeedback, 1, handlePhotoFeedbackSelect)}

                      {/* Worst Images */}
                      {getFeedbackImageList(profiles[iterator], 0, handleImageSelect)}

                      {/* Bad Image Feedback */}
                      {photoFeedback(badPhotoFeedback, 0, handlePhotoFeedbackSelect)}
                      
                      
                      {/* Bio */}
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                        <Typography variant='h5' sx={{ pb: 0, textAlign: 'center' }}>Bio</Typography>
                      </Box>

                      {/* Profile Bio */}
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', mb: 1 }}>
                        {profileBio(profiles[iterator], 1, 400)}
                      </Box>

                      {/* Overall Bio Feedback */}
                      {bioFeedback(overallBioFeedback, feedbackTypes[0], handleBioFeedbackSelect)}

                      {/* Good Bio Feedback */}
                      {bioFeedback(goodBioFeedback, feedbackTypes[1], handleBioFeedbackSelect)}

                      {/* Bad Bio Feedback */}
                      {bioFeedback(badBioFeedback, feedbackTypes[2], handleBioFeedbackSelect)}

                      {/* Submit Button */}
                      <Grid container textAlign='center'>
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit"  sx={{ width: .5, mt: 4, mb: 2 }}>Submit</Button>
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
                          <Typography sx={{ width: '100%', color: 'red' }}>All fields required.</Typography>
                        </Grid>
                      </Grid>
                    }
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
                    {getProfile(profiles[iterator], true, karma, handleLeftSwipe, handleRightSwipe)}
                  </Paper>
                </Container>
              </>

      }
    </>
  )
}

export default Home
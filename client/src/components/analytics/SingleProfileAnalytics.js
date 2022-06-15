import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../utilities/Spinner.js'

import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import { profileStatsImageList } from '../../helpers/imageHandling'
import { karmaBar } from '../../helpers/viewProfile.js'
import { getProfilesList, overallUserAnalyticsHorizontal, socialMediaMatches, photosFeedback, bioFeedback, mostFrequentPhotos, mostFrequentComments, commentFrequency } from '../../helpers/analytics.js'
import { profileBio } from '../../helpers/viewProfile.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'

import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'

import profPicDefault from '../../images/prof-pic-default.png'



const SingleProfileAnalytics = () => {

  // Navigate
  const navigate = useNavigate()

  //Params
  const { profileId } = useParams()

  //Payload
  const payload = getPayload()
  // console.log('payload sub ->', payload.sub)

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //User variables
  const [selectedProfile, setSelectedProfile] = useState({ })
  const [profileStats, setProfileStats] = useState([ ])
  const [bestImagesWithComments, setBestImagesWithComments] = useState([ ])
  const [worstImagesWithComments, setWorstImagesWithComments] = useState([ ])

  // Get Profile Data
  useEffect(() => {
    const getData = async () => {
      try {

        // User must have an account to view profiles
        if (!userIsAuthenticated()) {
          navigate('/login')
        }


        // // Get data for specified user, by username
        // const { data } = await axios.get(`/api/auth/users/${payload.sub}/`, {
        //   headers: {
        //     Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        //   },
        // })
        // // console.log('data is ->', data)
        // const retrievedUser = data
        // console.log('retrieved user ->', retrievedUser)

        // const sp = retrievedUser.profiles.filter(profile => profile.id === parseInt(profileId))
        // console.log('profile Id ->', parseInt(profileId))
        // console.log('retrieved user profile Id ->', retrievedUser.profiles[0].id)
        // console.log('sp ->', sp[0])

        // // Set Profile State
        // setSelectedProfile({ ...sp[0] })


        // console.log('sp[0] swipes ->', sp[0].swipes)
        // setProfileStats({ ...sp[0].swipes })
        
        
        

        // Get data for specified profile, by profile Id
        const { data } = await axios.get(`/api/profiles/${profileId}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        // console.log('data is ->', data)
        const retrievedProfile = data
        console.log('retrieved profile ->', retrievedProfile)
        setSelectedProfile({ ...retrievedProfile })

        console.log('retrievedProfile swipes ->', retrievedProfile.swipes)
        setProfileStats([ ...retrievedProfile.swipes ])
        
        const selectedProfileArray = [retrievedProfile]
        const bestPhotos = mostFrequentPhotos(retrievedProfile.swipes, 1, selectedProfileArray)
        console.log('best photos', bestPhotos)

        const bestImagesWithCommentsArray = []
        for (let p = 0; p < bestPhotos.length; p++) {
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = bestPhotos[p]
          const goodComments = mostFrequentComments(retrievedProfile.swipes, 1, bestPhotos[p], selectedProfileArray)
          console.log('good comments ->', goodComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...goodComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...goodComments ]
          }

          const goodCommentsFrequency = []
          for (let i = 0; i < goodComments.length; i++) {
            const frequencyOfComment = commentFrequency(retrievedProfile.swipes, 1, bestPhotos[p], selectedProfileArray, goodComments[i])
            goodCommentsFrequency.push(frequencyOfComment)

          }
          console.log('good comment frequency', goodCommentsFrequency)
          imagesWithCommentsObj.frequency = goodCommentsFrequency
          bestImagesWithCommentsArray.push(imagesWithCommentsObj)
        }
        console.log('best images with comments ->', bestImagesWithCommentsArray)
        setBestImagesWithComments([ ...bestImagesWithCommentsArray ])


        const worstPhotos = mostFrequentPhotos(retrievedProfile.swipes, 0, selectedProfileArray)
        console.log('worst photos', worstPhotos)

        const worstImagesWithCommentsArray = []
        for (let p = 0; p < worstPhotos.length; p++) {
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = worstPhotos[p]
          const badComments = mostFrequentComments(retrievedProfile.swipes, 0, worstPhotos[p], selectedProfileArray)
          console.log('bad comments ->', badComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...badComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...badComments ]
          }

          const badCommentsFrequency = []
          for (let i = 0; i < badComments.length; i++) {
            const frequencyOfComment = commentFrequency(retrievedProfile.swipes, 0, worstPhotos[p], selectedProfileArray, badComments[i])
            badCommentsFrequency.push(frequencyOfComment)

          }
          console.log('bad comment frequency', badCommentsFrequency)
          imagesWithCommentsObj.frequency = badCommentsFrequency
          worstImagesWithCommentsArray.push(imagesWithCommentsObj)
        }
        console.log('worst images with comments ->', worstImagesWithCommentsArray)
        setWorstImagesWithComments([ ...worstImagesWithCommentsArray ])


      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [navigate])

  const getStateVariable = (stateVariable) => {
    console.log('state variable ->', stateVariable)
    console.log('state variable length ->', stateVariable.length)
  }

  return (
    <>
      <Container key={'apsdiofa'} maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Paper key={'asdfwe'} elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4, borderRadius: 4 }} >
          <Box key={'vnpasd'} sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
            
            
            {/* {getStateVariable(selectedProfile)} */}

            {/* Images List */}
            {Object.keys(selectedProfile).length !== 0 && profileStatsImageList(selectedProfile)}

            {/* Bio */}
            <Box key={'vpifsaf'} sx={{ mb: 4 }}>
              {profileBio(selectedProfile)}

              {/* Line at bottom of  */}
              <Divider key={'28'} sx={{ mt: 4 }} />
            </Box>

            {/* Inulytics  */}
            {loading ?
              <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }}>
                <Spinner />
              </Container>
              : errors ?
                <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
                  <Typography variant='p' sx={{ color: 'red' }}>
                    Error! Could not fetch data!
                  </Typography>
                </Container>
                : profileStats.length > 0 ?
                  <>
                    {/* Overall Stats */}
                    {overallUserAnalyticsHorizontal(profileStats)}

                    {/* Best Photos */}
                    {photosFeedback(bestImagesWithComments, 1 )}

                    {/* Worst Photos */}
                    {photosFeedback(worstImagesWithComments, 0 )}


                    {/* Bio */}
                    {bioFeedback(profileStats)}

                  </>
                  :
                  <>
                    <Typography variant='p'>
                      No Inulytics yet. Swipe through other profiles to increase your karma
                    </Typography>
                  </>
            }
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default SingleProfileAnalytics
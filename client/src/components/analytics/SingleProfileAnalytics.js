import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../utilities/Spinner.js'

import { getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import { profileStatsImageList } from '../../helpers/profileImageLists'
import { bestAndWorstPhotosWithComments, photosFeedback } from '../../helpers/photosBestWorst.js'
import { overallUserAnalyticsHorizontal } from '../../helpers/overallStats.js'
import { bioFeedback } from '../../helpers/bioFeedback.js'
import { profileBio } from '../../helpers/viewProfile.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'



// Retrieves stats for a single profile
// Accessed by clicking the bar graph icon button in the profile list in UserAccount.js
const SingleProfileAnalytics = () => {

  // Navigate
  const navigate = useNavigate()

  //Params
  const { profileId } = useParams()

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //User variables
  const [selectedProfile, setSelectedProfile] = useState({ }) //The entire object for the selected profile (age, name, bio, etc.)
  const [profileStats, setProfileStats] = useState([ ]) //The swipe data for the selected profile
  const [bestImagesWithComments, setBestImagesWithComments] = useState([ ]) //Best images with comments for the selected profile
  const [worstImagesWithComments, setWorstImagesWithComments] = useState([ ]) // Worst images with comments for the selected profile


  // Get Profile Data
  useEffect(() => {
    const getData = async () => {
      try {

        // User must have an account to view profiles
        if (!userIsAuthenticated()) {
          navigate('/login')
        }

        // Get data for specified profile, by profile Id
        const { data } = await axios.get(`/api/profiles/${profileId}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        // console.log('data is ->', data)
        const retrievedProfile = data //The retrieved profile
        // console.log('retrieved profile ->', retrievedProfile)
        setSelectedProfile({ ...retrievedProfile }) //Set the selectedProfile state to the retrieved profile

        // console.log('retrievedProfile swipes ->', retrievedProfile.swipes)
        setProfileStats([ ...retrievedProfile.swipes ]) //Set the profileStats state to the profile's swipe data
        
        const selectedProfileArray = [retrievedProfile] //Convert retrieved profile into an array with one object at index zero so it can be passed into the mostFrequentPhotos method; Must be an array because the method is also used for overall inulytics, where there are multiple profiles
        
        //Set bestImagesWithComments state to an array of objects with image as one key, the comments, as another, and the frequency as a third, all ordered from most to least
        const bestImagesWithCommentsArray = bestAndWorstPhotosWithComments(retrievedProfile.swipes, 1, selectedProfileArray)
        setBestImagesWithComments([ ...bestImagesWithCommentsArray ]) 

        //Set worstImagesWithComments state to an array of objects with image as one key, the comments, as another, and the frequency as a third, all ordered from most to least
        const worstImagesWithCommentsArray = bestAndWorstPhotosWithComments(retrievedProfile.swipes, 0, selectedProfileArray)
        setWorstImagesWithComments([ ...worstImagesWithCommentsArray ])


      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [navigate])

  return (
    <>
      <Container key={'apsdiofa'} maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Paper key={'asdfwe'} elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4, borderRadius: 4 }} >
          <Box key={'vnpasd'} sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>

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
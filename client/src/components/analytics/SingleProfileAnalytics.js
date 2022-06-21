import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../utilities/Spinner.js'

import { getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import { profileStatsImageList } from '../../helpers/imageHandling'
import { overallUserAnalyticsHorizontal, photosFeedback, bioFeedback, mostFrequentPhotos, mostFrequentComments, commentFrequency } from '../../helpers/analytics.js'
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
        console.log('retrieved profile ->', retrievedProfile)
        setSelectedProfile({ ...retrievedProfile }) //Set the selectedProfile state to the retrieved profile

        console.log('retrievedProfile swipes ->', retrievedProfile.swipes)
        setProfileStats([ ...retrievedProfile.swipes ]) //Set the profileStats state to the profile's swipe data
        
        const selectedProfileArray = [retrievedProfile] //Convert retrieved profile into an array with one object at index zero so it can be passed into the mostFrequentPhotos method; Must be an array because the method is also used for overall inulytics, where there are multiple profiles
        const bestPhotos = mostFrequentPhotos(retrievedProfile.swipes, 1, selectedProfileArray) //Retrieves an object with keys that are photo URLs and values that are the number of times the photo was selected as the best photo, ordered from most to least
        bestPhotos.length = 3 //Keep only the three most popular photos
        // console.log('best photos', bestPhotos)

        const bestImagesWithCommentsArray = []
        for (let p = 0; p < bestPhotos.length; p++) { //loop through the bestPhotos array
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = bestPhotos[p] // set the image value equal to the best photo index
          const goodComments = mostFrequentComments(retrievedProfile.swipes, 1, bestPhotos[p], selectedProfileArray) //retrieve an array of the most frequent good comments on a specified photo as a key, and the number of times it appears as a value, sorted from most to least 
          // console.log('good comments ->', goodComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...goodComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...goodComments ]
          } //Set the comments equal to the accumulated good comments on the photo
          //PERHAPS THE FIRST PART OF THIS IF STATEMENT ISN'T NECESSARY FOR SINGLE PROFILE ANALYTICS

          const goodCommentsFrequency = []
          for (let i = 0; i < goodComments.length; i++) { //Loop through good comments
            const frequencyOfComment = commentFrequency(retrievedProfile.swipes, 1, bestPhotos[p], selectedProfileArray, goodComments[i])
            goodCommentsFrequency.push(frequencyOfComment)
          } //Returns the number of times each of the best comments appears in an array of numbers whose order corresponds to the array of comments
          // The above method can likely be simplified by a lot. A lot of redundant code that isn't used
          // console.log('good comment frequency', goodCommentsFrequency)
          imagesWithCommentsObj.frequency = goodCommentsFrequency // set the frequency equal to the comment frequency array
          bestImagesWithCommentsArray.push(imagesWithCommentsObj) // push the object with the image, comments, and freqency keys onto the array that has these values for all images, ordered from most to least often voted as best photo
        }
        console.log('best images with comments ->', bestImagesWithCommentsArray)
        setBestImagesWithComments([ ...bestImagesWithCommentsArray ]) //Set bestImagesWithComments state to an array of objects with image as one key, the comments, as another, and the frequency as a third, all ordered from most to least


        //The same as above but for worst photo; it might be possible to combine the best and worst methods into one
        const worstPhotos = mostFrequentPhotos(retrievedProfile.swipes, 0, selectedProfileArray)  //Retrieves an object with keys that are photo URLs and values that are the number of times the photo was selected as the worst photo, ordered from most to least
        worstPhotos.length = 3 //Keep only the three most unpopular popular photos
        // console.log('worst photos', worstPhotos)

        const worstImagesWithCommentsArray = []
        for (let p = 0; p < worstPhotos.length; p++) { //loop through the worstPhotos array
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = worstPhotos[p] // set the image value equal to the best photo index
          const badComments = mostFrequentComments(retrievedProfile.swipes, 0, worstPhotos[p], selectedProfileArray) //retrieve an array of the most frequent good comments on a specified photo as a key, and the number of times it appears as a value, sorted from most to least
          // console.log('bad comments ->', badComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...badComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...badComments ]
          } //Set the comments equal to the accumulated bad comments on the photo
          //PERHAPS THE FIRST PART OF THIS IF STATEMENT ISN'T NECESSARY FOR SINGLE PROFILE ANALYTICS

          const badCommentsFrequency = []
          for (let i = 0; i < badComments.length; i++) { //Loop through good comments
            const frequencyOfComment = commentFrequency(retrievedProfile.swipes, 0, worstPhotos[p], selectedProfileArray, badComments[i])
            badCommentsFrequency.push(frequencyOfComment)
          } //Returns the number of times each of the best comments appears in an array of numbers whose order corresponds to the array of comments
          // The above method can likely be simplified by a lot. A lot of redundant code that isn't used
          // console.log('bad comment frequency', badCommentsFrequency)
          imagesWithCommentsObj.frequency = badCommentsFrequency // set the frequency equal to the comment frequency array
          worstImagesWithCommentsArray.push(imagesWithCommentsObj) // push the object with the image, comments, and freqency keys onto the array that has these values for all images, ordered from most to least often voted as worst photo
        }
        // console.log('worst images with comments ->', worstImagesWithCommentsArray)
        setWorstImagesWithComments([ ...worstImagesWithCommentsArray ]) //Set worstImagesWithComments state to an array of objects with image as one key, the comments, as another, and the frequency as a third, all ordered from most to least


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
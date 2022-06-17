import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../utilities/Spinner.js'

import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import { getImageList } from '../../helpers/imageHandling'
import { karmaBar } from '../../helpers/viewProfile.js'
import { getProfilesList, overallUserAnalyticsHorizontal, socialMediaMatches, photosFeedback, bioFeedback, mostFrequentPhotos, mostFrequentComments, commentFrequency } from '../../helpers/analytics.js'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
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


function TabPanel(props) {
  const { children, value, index, ...other } = props
  const numberValue = parseFloat(value)

  return (
    <div
      role="tabpanel"
      hidden={numberValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {numberValue === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}


const UserAccount = () => {

  // Navigate
  const navigate = useNavigate()

  //Params
  const { userId } = useParams()

  //Payload
  const payload = getPayload()
  console.log('payload sub ->', payload.sub)

  //Keeps track of which tab we are in, default is My Profiles at index 0
  const [value, setValue] = useState(0)

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  //User variables
  const [accountUser, setAccountUser] = useState({ })
  const [accountCurrentProfile, setAccountCurrentProfile] = useState({ })
  const [accountProfiles, setAccountProfiles] = useState([ ])
  const [accountOverallStats, setAccountOverallStats] = useState([ ])
  const [accountMatches, setAccountMatches] = useState([ ])
  const [bestImagesWithComments, setBestImagesWithComments] = useState([ ])
  const [worstImagesWithComments, setWorstImagesWithComments] = useState([ ])


  // More Options Button
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (e) => {
    setAnchorEl(null)
    console.log('handle close event target ->', e.currentTarget)
    console.log('handle close event target classlist ->', e.currentTarget.classList)
    const optionPressed = e.currentTarget.classList[0]
    const profileId = parseInt(e.currentTarget.classList[1])
    console.log('profile Id index ->', profileId)
    console.log('option pressed ->', optionPressed)
    
    
    if (optionPressed === 'view') {
      navigate(`/account/${userId}/${profileId}`)
    } else if (profileId) {
      navigate(`/analytics/profile/${profileId}`)
    }

  }

  // Get User Data
  useEffect(() => {
    const getData = async () => {
      try {

        // User must have an account to view profiles
        if (!userIsAuthenticated()) {
          navigate('/login')
        }

        // Get data for specified user, by username
        const { data } = await axios.get(`/api/auth/users/${payload.sub}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        // console.log('data is ->', data)
        const retrievedUser = data
        // console.log('retrievedUser ->', retrievedUser)

        // Set User and Profile States
        setAccountUser({ ...retrievedUser })
        
        console.log('retrievedUser profiles ->', retrievedUser.profiles)

        setAccountProfiles([ ...retrievedUser.profiles ].reverse())
        

        const cp = retrievedUser.profiles.filter(profile => profile.id === retrievedUser.current_profile)
        // console.log('cp ->', cp[0])
        setAccountCurrentProfile({ ...cp[0] })

        const accumulatedProfileStats = []
        for (let i = 0; i < retrievedUser.profiles.length; i++) {
          accumulatedProfileStats.push(...retrievedUser.profiles[i].swipes)
        }
        // console.log('accumulated profile stats ->', accumulatedProfileStats)
        setAccountOverallStats([ ...accumulatedProfileStats ])

        console.log('retrieved user matches ->', retrievedUser.matches)
        setAccountMatches([ ...retrievedUser.matches ])



        const bestPhotos = mostFrequentPhotos(accumulatedProfileStats, 1, retrievedUser.profiles)

        const bestImagesWithCommentsArray = []
        for (let p = 0; p < bestPhotos.length; p++) {
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = bestPhotos[p]
          const goodComments = mostFrequentComments(accumulatedProfileStats, 1, bestPhotos[p], retrievedUser.profiles)
          console.log('good comments ->', goodComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...goodComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...goodComments ]
          }

          const goodCommentsFrequency = []
          for (let i = 0; i < goodComments.length; i++) {
            const frequencyOfComment = commentFrequency(accumulatedProfileStats, 1, bestPhotos[p], retrievedUser.profiles, goodComments[i])
            goodCommentsFrequency.push(frequencyOfComment)

          }
          console.log('good comment frequency', goodCommentsFrequency)
          imagesWithCommentsObj.frequency = goodCommentsFrequency
          bestImagesWithCommentsArray.push(imagesWithCommentsObj)
        }
        console.log('best images with comments ->', bestImagesWithCommentsArray)
        setBestImagesWithComments([ ...bestImagesWithCommentsArray ])


        const worstPhotos = mostFrequentPhotos(accumulatedProfileStats, 0, retrievedUser.profiles)
        
        const worstImagesWithCommentsArray = []
        for (let p = 0; p < worstPhotos.length; p++) {
          const imagesWithCommentsObj = []
          imagesWithCommentsObj.image = worstPhotos[p]
          const badComments = mostFrequentComments(accumulatedProfileStats, 0, worstPhotos[p], retrievedUser.profiles)
          console.log('bad comments ->', badComments)

          if (imagesWithCommentsObj.comments) {
            imagesWithCommentsObj.comments = [ ...imagesWithCommentsObj.comments, ...badComments[p]]
          } else {
            imagesWithCommentsObj.comments = [ ...badComments ]
          }

          const badCommentsFrequency = []
          for (let i = 0; i < badComments.length; i++) {
            const frequencyOfComment = commentFrequency(accumulatedProfileStats, 0, worstPhotos[p], retrievedUser.profiles, badComments[i])
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

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleEditSettings = (e) => {
    e.preventDefault()
    if (accountUser.id === payload.sub) {
      navigate(`/account/${accountUser.id}/settings`)
    }
  }

  const handleAddProfile = (e) => {
    e.preventDefault()
    if (accountUser.id === payload.sub) {
      navigate(`/account/${accountUser.id}/new-profile`)
    }
  }

  
  
  return (
    <>
      <Container maxWidth='lg' sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <Paper elevation={6} sx={{ m: 5, py: 3, backgroundColor: 'cream', pl: 4, pr: 4, borderRadius: 4 }} >
          <Box sx={{ flexGrow: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
            {/* Profile Picture */}
            <Avatar alt={accountUser.username} src={accountCurrentProfile.images ? accountCurrentProfile.images[0] : profPicDefault } sx={{ width: 220, height: 220, boxShadow: 4 }} />

            {/* Name and Age */}
            <Typography variant='h5' sx={{ fontWeight: 'bold', mt: 1 }}>{accountCurrentProfile.name}, {accountCurrentProfile.age}</Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 3, mb: 4 }}>
              <Box onClick={handleEditSettings} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
                <IconButton aria-label="swipe-left" size="large" >
                  <SettingsIcon fontSize="large" sx={{ color: 'primary.main' }} />
                </IconButton>
              </Box>
              <Box onClick={handleAddProfile} sx={{ ml: 6, mr: 6, boxShadow: 4, border: 2, borderRadius: '50%', display: 'flex', alignItems: 'center' }} >
                <IconButton aria-label="swipe-right" size="large" >
                  <AddIcon fontSize="large" sx={{ color: 'primary.main' }} />
                </IconButton>
              </Box>
            </Box>

            {/* Karma Bar */}
            <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {karmaBar(accountUser.karma, 300)}
              <Typography variant='p' sx={{ overflow: 'wrap', width: 300, mt: 1 }}>
                *Increase your karma by swiping through other profiles
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{ borderTop: 1, borderColor: 'divider' }}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab label="Profiles" {...a11yProps(0)} />
              <Tab label="Inulytics" {...a11yProps(1)} />
            </Tabs>
          </Box>

          {/* Tab Views */}
          {/* Profiles  */}
          <TabPanel value={value} index={0}>
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
                : accountProfiles.length > 0 ?
                  <>
                    {getProfilesList(accountProfiles, accountCurrentProfile.id, open, handleMenuOpen, handleClose, anchorEl)}
                  </>
                  :
                  <>
                    <Typography variant='p'>
                      Click the + button to add your first profile
                    </Typography>
                  </>
            }
          </TabPanel>

          {/* Inulytics  */}
          <TabPanel value={value} index={1}>
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
                : accountOverallStats.length > 0 ?
                  <>
                    {/* Overall Stats */}
                    {overallUserAnalyticsHorizontal(accountOverallStats)}

                    {/* Social Media Matches */}
                    {socialMediaMatches(accountMatches, accountUser.id, 0, 1 )}

                    {/* Best Photos */}
                    {photosFeedback(bestImagesWithComments, 1 )}

                    {/* Worst Photos */}
                    {photosFeedback(worstImagesWithComments, 0 )}


                    {/* Bio */}
                    {bioFeedback(accountOverallStats)}

                  </>
                  :
                  <>
                    <Typography variant='p'>
                      No Inulytics yet. Swipe through other profiles to increase your karma
                    </Typography>
                  </>
            }
          </TabPanel>
        </Paper>
      </Container>
    </>
  )
}

export default UserAccount
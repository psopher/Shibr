import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'
import { getProfile, profileBio } from '../../helpers/viewProfile'
import { goodPhotoFeedback, badPhotoFeedback, feedbackTypes, overallBioFeedback, goodBioFeedback, badBioFeedback } from '../../helpers/formOptions'
import { photoFeedback, bioFeedback } from '../../helpers/formMethods'
import { getFeedbackImageList } from '../../helpers/imageHandling.js'
import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'
import { getMatchesList } from '../../helpers/analytics'

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



const SocialMediaMatches = () => {

  // Navigate
  const navigate = useNavigate()

  //Params
  const { userId } = useParams()

  //Payload
  const payload = getPayload()

  //profile state 
  const [matchedUsers, setMatchedUsers] = useState([])

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)// Get User Data


  const handleViewMatch = (e) => {
    console.log('handle view match event target classList ->', e.currentTarget.classList)
    const selectedProfileId = parseInt(e.currentTarget.classList[0])
    const selectedUserId = parseInt(e.currentTarget.classList[1])
    
    navigate(`/account/${selectedUserId}/${selectedProfileId}`)

  }

  useEffect(() => {
    const getData = async () => {
      try {

        // User must have an account to view profiles
        if (!userIsAuthenticated()) {
          navigate('/login')
        }

        // Get data for specified user, by userId
        const { data } = await axios.get(`/api/auth/users/${payload.sub}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        console.log('data is ->', data)
        const retrievedUser = data
        // console.log('retrievedUser ->', retrievedUser)

        console.log('retrieved user matches ->', retrievedUser.matches)

        const matchedUsersArray = []
        retrievedUser.matches.forEach(match => {
          console.log('match ->', match)
          const userToAdd = match.matched_users.filter(user => user.id !== parseInt(userId))
          matchedUsersArray.push(userToAdd[0])
        })

        console.log('matchedUsersArray ->', matchedUsersArray)


        setMatchedUsers([ ...matchedUsersArray ])


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
      {
        loading ?
          <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', my: '10%' }} >
            <Spinner />
          </Container >
          : errors ?
            <RequestError />
            : 
            // View Matchs
            <>

              <Container maxWidth='xs' sx={{ pb: 4, pt: 4 }}>
                {/* <Container > */}
                <Paper sx={{ pt: 2, pb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'cream', boxShadow: 4, borderRadius: 4 }} >
                  {/* Image List */}
                  {getMatchesList(matchedUsers, handleViewMatch)}
                </Paper>
              </Container>
            </>

      }
    </>
  )
}

export default SocialMediaMatches
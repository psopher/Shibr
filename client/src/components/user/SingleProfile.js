import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'
import { getProfile, profileBio } from '../../helpers/viewProfile'
import { goodPhotoFeedback, badPhotoFeedback, feedbackTypes, overallBioFeedback, goodBioFeedback, badBioFeedback } from '../../helpers/formOptions'
import { photoFeedback, bioFeedback } from '../../helpers/formMethods'
import { getFeedbackImageList } from '../../helpers/imageHandling.js'
// import { getUserFromLocalStorage } from '../../helpers/storage'
import { getPayload, getTokenFromLocalStorage, userIsAuthenticated } from '../../helpers/auth'

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

const SingleProfile = () => {

  // Navigate
  const navigate = useNavigate()

  //Params
  const { userId, profileId } = useParams()

  //Payload
  const payload = getPayload()

  //profile state 
  const [profile, setProfile] = useState({})

  //loading and error state
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        
        // Get data for specified profile, by profile Id
        const { data } = await axios.get(`/api/profiles/${profileId}/`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })

        setProfile({ ...data })

      } catch (error) {
        console.log(error)
        setErrors(true)
      }
      setLoading(false)
    }
    getData()
  }, [])



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
            // Profile View
            <>
              <Container maxWidth='xs' sx={{ pb: 4, pt: 4 }}>
                {/* <Container > */}
                <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'cream', boxShadow: 4, borderRadius: 4 }} >
                  {/* Image List */}
                  {getProfile(profile, 0)}
                </Paper>
              </Container>
            </>

      }
    </>
  )
}

export default SingleProfile
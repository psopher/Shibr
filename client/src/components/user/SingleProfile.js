// React
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Axios
import axios from 'axios'

// Loading and Error Views
import Spinner from '../utilities/Spinner'
import RequestError from '../common/RequestError'

// Helper Methods
import { getProfile } from '../../helpers/viewProfile'
import { getPayload, getTokenFromLocalStorage } from '../../helpers/auth'

//mui
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'

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
                <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'cream', boxShadow: 4, borderRadius: 4 }} >
                  
                  {/* Image List and Bio*/}
                  {getProfile(profile, 0)}

                </Paper>
              </Container>
            </>

      }
    </>
  )
}

export default SingleProfile
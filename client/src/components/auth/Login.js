import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'


const theme = createTheme()

const Login = () => {
  // Navigate
  const navigate = useNavigate()

  // Form data passed by user
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  })

  //Error Handling
  const [ errors, setErrors ] = useState(false)


  //Save to local storage
  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem('shibr', token)
  }

  //Submit request
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.email && formData.password) {
      try {
        // POST the email and password to the login endpoint
        const { data } = await axios.post('api/auth/login/', formData)
        
        // console.log('token -> ', data.token)

        // Set the token to local storage
        setTokenToLocalStorage(data.token)
        
        // Navigate to Home.js
        navigate('/')
      } catch (err) {
        console.log(err)

        // set errors to true if the email or password is wrong
        setErrors(true)
      }
    } else {

      // Set errors to true if the email or password is missing
      setErrors(true)
    }
  }

  // ? Handle change
  const handleChange = (e) => {
    // Re-set the form data state to incorporate all changes
    setFormData({ ...formData, [e.target.name]: e.target.value })

    // Set errors to false if the form is changed
    setErrors(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Lock Icon */}
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        {/* Header */}
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          
          {/* Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email} 
            onChange={handleChange}
          />

          {/* Password */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password} 
            onChange={handleChange}
          />

          {/* Errors if there are errors */}
          {errors && 
            <Grid item xs={12}>
              <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ color: 'red' }}>Unauthorised.</Typography>
              </Container>
            </Grid>  
          }

          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          {/* Link to Register page for people without accounts */}
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {'No account yet? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Login
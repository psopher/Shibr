
//mui
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import { getSwipesPercent } from './commonSnippets.js'
import { feedbackTypes } from './formOptions'



// BIO FEEDBACK

// Pass in swipes and retrieve an object with overall bio feedback options as keys and number of times they appear as values
const getBioFeedbackNumber = (swipesArray) => {
  const goodBioArray = swipesArray.filter(swipe => swipe.feedback[0].bio_overall === 'Good')
  const sosoBioArray = swipesArray.filter(swipe => swipe.feedback[0].bio_overall === 'So-So')
  const badBioArray = swipesArray.filter(swipe => swipe.feedback[0].bio_overall === 'Bad')

  const bioObj = { 
    'good': goodBioArray.length, 
    'soso': sosoBioArray.length, 
    'bad': badBioArray.length,
  }
  return bioObj
}

// Analytics for the bio, given an array of swipes
export const bioFeedback = (swipes) => {
  
  return (
    <Stack key={'1'} spacing={0}>

      {/* Bio Label */}
      <Box key = {'10'} spacing={0} sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
        <Typography key={'9'} variant='p' sx={{ mt: 0 }}>
          Bio:
        </Typography>
      </Box>

      {/* Bio Feedback */}
      <Box key={'1'} sx={{ width: 300, mt: 1, mb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        
        {/* 'Good' rating */}
        <Box key={'1'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Good
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getBioFeedbackNumber(swipes).good, swipes.length) : 0}%
          </Typography>
        </Box>
        
        {/* 'So-So' rating */}
        <Box key={'2'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            So-So
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getBioFeedbackNumber(swipes).soso, swipes.length) : 0}%
          </Typography>
        </Box>
        
        {/* 'Bad' rating */}
        <Box key={'3'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Bad
          </Typography>
          <Typography key={'2'}>
            {swipes.length > 0 ? getSwipesPercent(getBioFeedbackNumber(swipes).bad, swipes.length) : 0}%
          </Typography>
        </Box>

      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 2 }} />

    </Stack>
  )
}



// GIVING FEEDBACK WHEN SWIPING

// Options for why the bio is good/bad/soso
// Called in the home.js feedback section
export const bioSwipeFeedback = (feedbackArray = [], feedbackType = feedbackTypes[0], handleBioFeedbackSelect) => {
  console.log('bioFeedback runs!!!')
  return (
    <>
      {/* bio feedback type label */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 2, mb: 0 }}>
        <Typography variant='h6'>
          {`${feedbackType}:`}
        </Typography>
      </Box>

      {/* bio feedback options */}
      <Container key={'1'} maxWidth='xs' sx={{ mb: 1, mt: 0 }}>
        <Box textAlign='center'>
          <Grid container spacing={1}>
            {feedbackArray.map((feedback, i) => {
              return (
                <Grid item xs={feedback === 'I Like Nothing' || feedback === 'I Like Everything' ? 6 : 3} key={i}>
                  <Box
                    onClick={(e) => handleBioFeedbackSelect(e, feedbackType)}
                    className= {feedback === feedbackArray[feedbackArray.length - 1] ? `bio-${feedbackType.toLocaleLowerCase()}-feedback bio-${feedbackType.toLocaleLowerCase()}-feedback-end` : `bio-${feedbackType.toLocaleLowerCase()}-feedback`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'gray',
                      borderRadius: 10,
                      p: 1,
                      fontSize: 14,
                      fontFamily: 'Lato',
                      '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: '#e0e0e0',
                      },
                    }}>
                    {feedback}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Container>
    
    </>
  )
}  
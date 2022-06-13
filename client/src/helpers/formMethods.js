
import { feedbackTypes } from './formOptions'

//mui
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'


export const photoFeedback = (feedbackArray = [], isGoodFeedback = 1, handlePhotoFeedbackSelect) => {
  return (
    <>
      <Container key={'1'} maxWidth='xs' sx={{ mb: 4, mt: 0 }}>
        <Box textAlign='center'>
          {/* <Typography>Flower Color</Typography> */}
          <Grid container spacing={1}>
            {feedbackArray.map((feedback, i) => {
              return (
                <Grid item xs={feedback === 'No Good Images' || feedback === 'No Bad Images' ? 6 : 3} key={i}>
                  <Box
                    onClick={handlePhotoFeedbackSelect}
                    className= {isGoodFeedback ? 'good-feedback' : 'bad-feedback'}
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

export const bioFeedback = (feedbackArray = [], feedbackType = feedbackTypes[0], handleBioFeedbackSelect) => {
  console.log('bioFeedback runs!!!')
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 2, mb: 0 }}>
        <Typography variant='h6'>
          {`${feedbackType}:`}
        </Typography>
      </Box>
      <Container key={'1'} maxWidth='xs' sx={{ mb: 1, mt: 0 }}>
        <Box textAlign='center'>
          <Grid container spacing={1}>
            {feedbackArray.map((feedback, i) => {
              return (
                <Grid item xs={feedback === 'I Like Nothing' || feedback === 'I Like Everything' ? 6 : 3} key={i}>
                  <Box
                    onClick={handleBioFeedbackSelect}
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
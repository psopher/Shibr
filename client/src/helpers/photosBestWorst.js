
//mui
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Masonry from '@mui/lab/Masonry'
import ImageListItem from '@mui/material/ImageListItem'

// Images
import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'



// BEST/WORST PHOTOS WITH COMMENTS — DISPLAY

// The Best/Worst photos and the most common comments on the respective photos
export const photosFeedback = (imagesWithCommentsArray, isBest = true ) => {
  return (
    <Stack>
      
      <Box key = {`aoasid${isBest}`} spacing={0} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>

        {/* Header (Best Photos or Worst Photos) */}
        <Typography key={'9'} variant='p' sx={{ mt: 0 }}>{isBest ? 'Best Photos:' : 'Worst Photos:'}</Typography>
        
        <Box key={'8'} sx={{ width: 300, mt: 2, mb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {imagesWithCommentsArray.map((imageWithComments, index) => {
            return (
              <Box key={`asdf${isBest}${index}`} sx={{ width: 75, height: 75, display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center' }}>
                {/* A best or worst image */}
                <img
                  src={imageWithComments.image !== 'undefined' ? imageWithComments.image : isBest ? noGoodImages : noBadImages}
                  alt={index}
                  value={index}
                  loading='lazy'
                  className={imagesWithCommentsArray.length > 0 ? 'yes-photo' : 'no-photo'}
                  key={`image-${index}`}
                />

                {/* Comments beneath the best or worst image */}
                <Box key={`aoid${isBest}`} sx={{ textOverflow: 'clip', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[0] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[0]} x ${imageWithComments.frequency[0]}`
                      :
                      '-'
                    }
                  </Typography>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[1] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[1]} x ${imageWithComments.frequency[1]}`
                      :
                      '-'
                    }
                  </Typography>
                  <Typography sx={{ textAlign: 'center', fontSize: '1.2vw', width: 75, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1 }}>
                    {imageWithComments.image && imageWithComments.comments[2] && imageWithComments.comments[1] !== 'No Comments' ?
                      `${imageWithComments.comments[2]} x ${imageWithComments.frequency[2]}`
                      :
                      '-'
                    }
                  </Typography>
                </Box>
              </Box>
            )
          })}
          
          
        </Box>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 8 }} />
    </Stack>
  )
}



// BEST AND WORST PHOTOS WITH MOST COMMON COMMENTS —— DATA MANIPULATION

// Pass in swipes, profiles and whether you want best/worst
// Retrieve an object with keys that are photo URLs and values that are the number of times the photo was selected as the best photo, ordered from most to least 
export const mostFrequentPhotos = (swipes, isBest = true, profiles) => {
  
  const photosArray = []

  //Loop through all swipes
  for (let i = 0; i < swipes.length; i++) {
    //Filter out all profiles except for the one that the swipe corresponds to 
    const profileWithPhoto = profiles.filter(profile => profile.id === swipes[i].swiped_profile_id)

    //Get the URL for the best/worst image on the profile
    const imageOnProfile = profileWithPhoto[0].images[isBest ? swipes[i].feedback[0].best_image_index : swipes[i].feedback[0].worst_image_index]
    
    //Push this image URL 
    photosArray.push(imageOnProfile)
  } // End up with an array of best/worst photos for all inputted swipes

  // console.log('photos array', photosArray)

  const photosObject = {}
  //loop through the photos array
  for (let i = 0; i < photosArray.length; i++) {
    if (photosObject[photosArray[i]]){
      //The key is the photo url, and the value is the number of times this photo appears as the best/worst photo
      photosObject[photosArray[i]] = photosObject[photosArray[i]] + 1
    } else {
      //if it's the first time the photo has appeared, set the value to one
      photosObject[photosArray[i]] = 1
    }
  }

  // console.log('photos object ->', photosObject)
  const keysSorted = Object.keys(photosObject).sort((a,b) => photosObject[b] - photosObject[a]) //Sort the keys by their values from most to least; End up with the most/least popular photos appearing first in the object
  // console.log('keys sorted ->', keysSorted)
  if (keysSorted.length > 3) {
    keysSorted.length = 3
  }

  //Return the object with the three most/least popular photos; keys are the photo urls, and values are the amount of times the photos appear
  return keysSorted 
}

// input swipes, a specific photo, profiles, and whether you are looking for best/worst
// return an object of best/worst comments as keys and number times they appear as values, sorted from most frequent to least frequent
export const mostFrequentComments = (swipes, isBest = true, photo, profiles) => {
  if (photo && photo !== 'undefined') { //if the photo has a url...

    const photosObject = {}

    //loop through all swipes
    for (let i = 0; i < swipes.length; i++){
      //Filter out all profiles except for the one that the swipe corresponds to 
      const profileWithPhoto = profiles.filter(profile => profile.id === swipes[i].swiped_profile_id)
      
      //Get the url for best/worst image on the profile
      const imageOnProfile = profileWithPhoto[0].images[isBest ? swipes[i].feedback[0].best_image_index : swipes[i].feedback[0].worst_image_index]

      // Get the comments for the best/worst image on the profile
      const imageComments = isBest ? swipes[i].feedback[0].best_image_comments : swipes[i].feedback[0].worst_image_comments

      if (photosObject[imageOnProfile]) {
        //If the image url is already a key on the object, push the new set of comments onto the end of the value, which is an array of comments array 
        photosObject[imageOnProfile] = [ ...photosObject[imageOnProfile], ...imageComments ]
      } else {
        //If this is the first time an image URL is found as a key, set it's value to the array of best/worst comments
        photosObject[imageOnProfile] = [ ...imageComments ] 
      }
    }

    const commentsObject = {}

    //loop through the comments array for the specified photo
    for (let i = 0; i < photosObject[photo].length; i++) {
      if (commentsObject[photosObject[photo][i]]){
        commentsObject[photosObject[photo][i]] = commentsObject[photosObject[photo][i]] + 1
      } else {
        commentsObject[photosObject[photo][i]] = 1
      }
    } //End up with a comments object, where the key is a good/bad comment, and the value is the number of times it appeared


    const keysSorted = Object.keys(commentsObject).sort((a,b) => commentsObject[b] - commentsObject[a]) //sorts the comments object so that the most frequent comments appear first

    if (keysSorted.length > 3) {
      keysSorted.length = 3
    }

    const valuesSorted = Object.values(commentsObject).sort((a,b) => commentsObject[b] - commentsObject[a]) //sorts the comments object so that the most frequent comments appear first
    if (valuesSorted.length > 3) {
      valuesSorted.length = 3
    }

    const commentsAndFrequencyObject = {
      'comments': keysSorted,
      'frequency': valuesSorted,
    }

    //return an object with best/worst comments as an array on the comments key, and the frequency of these comments as an array on the frequency key
    return commentsAndFrequencyObject

  } else {

    //If photo is undefined, there were no comments on it
    const commentsAndFrequencyObject = {
      'comments': ['No Comments', 'No Comments', 'No Comments'],
      'frequency': [0, 0, 0],
    }
    return commentsAndFrequencyObject

  }
}

export const bestAndWorstPhotosWithComments = (swipes, isBest = true, profileArray) => {
  
  //Retrieves an object with keys that are photo URLs and values that are the number of times the photo was selected as the best photo, ordered from most to least
  const photos = mostFrequentPhotos(swipes, isBest, profileArray)

  const bestImagesWithCommentsArray = []

  //loop through the bestPhotos array
  for (let p = 0; p < photos.length; p++) {
    
    //retrieve an array of the most frequent good comments on a specified photo as a key, and the number of times it appears as a value, sorted from most to least 
    const goodComments = mostFrequentComments(swipes, isBest, photos[p], profileArray)
    
    const imagesWithCommentsObj = {
      'image': photos[p],
      'comments': goodComments.comments,
      'frequency': goodComments.frequency,
    }

    // push the object with the image, comments, and freqency keys onto the array that has these values for all images, ordered from most to least often voted as best photo
    bestImagesWithCommentsArray.push(imagesWithCommentsObj)
  }
  // console.log('best images with comments ->', bestImagesWithCommentsArray)
  return bestImagesWithCommentsArray
}



// GIVING FEEDBACK WHEN SWIPING


// Options for why a photo is good
// Called in the home.js feedback portion
export const photoFeedback = (feedbackArray = [], isGoodFeedback = 1, handlePhotoFeedbackSelect) => {
  return (
    <>
      <Container key={'1'} maxWidth='xs' sx={{ mb: 4, mt: 0 }}>
        <Box textAlign='center'>
          <Grid container spacing={1}>
            {feedbackArray.map((feedback, i) => {
              return (

                // Display the feedback options
                <Grid item xs={feedback === 'No Good Images' || feedback === 'No Bad Images' ? 6 : 3} key={i}>
                  <Box
                    onClick={(e) => handlePhotoFeedbackSelect(e, isGoodFeedback)}
                    // className= {isGoodFeedback ? 'good-feedback' : 'bad-feedback'}
                    className= {feedback === 'No Good Images' || feedback === 'No Bad Images' ? isGoodFeedback ? 'good-feedback good-feedback-end' : 'bad-feedback bad-feedback-end' : isGoodFeedback ? 'good-feedback' : 'bad-feedback'}
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


// Image list for Feedback
// Called in feedback part of home.js
export const getFeedbackImageList = (profile, bestPhotos = true, handleImageSelect) => {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', mt: 0, mb: 0 }}>
        <Typography variant='h6'>
          {bestPhotos ? 'Best:' : 'Worst:'}
        </Typography>
      </Box>
      <Container key={'1'} maxWidth='xs' sx={{ mb: 2, mt: 1 }}>
        <Box sx={{ width: 400 }}>
          <Masonry key={'2'} columns={{ xs: 3, sm: 3, md: 3 }} spacing={1}>
            {profile.images.map((image, index) => {
              return (
                // Profile Image
                <ImageListItem key={index} >
                  <Box
                    key={index}
                    onClick={(e) => handleImageSelect(e, bestPhotos)}
                    sx={{ 
                      boxShadow: 4, 
                      mt: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ebebeb',
                      borderRadius: 5,
                      // p: 1,
                      fontFamily: 'Lato',
                      '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: '#e0e0e0',
                      },
                    }}>
                    <img
                      src={image}
                      alt={index}
                      value={index}
                      loading='lazy'
                      className={bestPhotos ? 'best-photos' : 'worst-photos'}
                    />
                  </Box>
                </ImageListItem>
              )
            })}

            {/* Final image — 'No Bad Photos' or 'No Good Photos' */}
            <ImageListItem key={100} >
              <Box 
                key={profile.images.length}
                onClick={(e) => handleImageSelect(e, bestPhotos)}
                sx={{ 
                  boxShadow: 4, 
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ebebeb',
                  borderRadius: 5,
                  // p: 1,
                  fontFamily: 'Lato',
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: '#e0e0e0',
                  },
                }}>
                <img
                  src={bestPhotos ? noGoodImages : noBadImages}
                  alt={profile.images.length}
                  value={profile.images.length}
                  loading='lazy'
                  className={bestPhotos ? 'best-photos' : 'worst-photos'}
                />
              </Box>
            </ImageListItem>
          </Masonry>
        </Box>
      </Container>
    </>
  )
}
// React
import { Link } from 'react-router-dom'

//mui
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import EqualizerIcon from '@mui/icons-material/Equalizer'

// Images
import noGoodImages from '../images/no-good-images.png'
import noBadImages from '../images/no-bad-images.png'
import profPicDefault from '../images/prof-pic-default.png'


// Pass in swipes and retrieve the number of right swipes
const getRightSwipesNumber = (swipesArray) => {
  const rightSwipesArray = swipesArray.filter(swipe => swipe.right_swipe)
  return rightSwipesArray.length
} 

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

// pass in sample size of a type of swipe and total number of swipes and retrieve a percentage
const getSwipesPercent = (sampleSize = 0, totalSwipes = 0) => {
  return (sampleSize / totalSwipes) * 100
} 


// Pass in swipes, profiles and whether you want best/worst
// Retrieve an object with keys that are photo URLs and values that are the number of times the photo was selected as the best photo, ordered from most to least 
export const mostFrequentPhotos = (swipes, isBest = true, profiles) => {
  
  // console.log('swipes ->', swipes)
  // console.log('isBest ->', isBest)
  // console.log('profiles ->', profiles)
  
  const photosArray = []

  for (let i = 0; i < swipes.length; i++) { //Loop through all swipes
    const profileWithPhoto = profiles.filter(profile => profile.id === swipes[i].swiped_profile_id) //Filter out all profiles except for the one that the swipe corresponds to 
    // console.log('profile with photo ->', profileWithPhoto[0])
    // console.log('best image index ->', swipes[i].feedback[0].best_image_index)
    // console.log('worst image index ->', swipes[i].feedback[0].worst_image_index)
    const imageOnProfile = profileWithPhoto[0].images[isBest ? swipes[i].feedback[0].best_image_index : swipes[i].feedback[0].worst_image_index] //Get the URL for the best/worst image on the profile
    // console.log('image on profile ->', imageOnProfile)
    photosArray.push(imageOnProfile) //Push this image URL 
  } // End up with an array of best/worst photos for every swipe on all of the specified profiles

  // console.log('photos array', photosArray)

  const photosObject = {}
  for (let i = 0; i < photosArray.length; i++) { //loop through the photos array
    if (photosObject[photosArray[i]]){
      photosObject[photosArray[i]] = photosObject[photosArray[i]] + 1 //The key is the photo url, and the value is the number of times this photo appears as the best/worst photo
    } else {
      photosObject[photosArray[i]] = 1 //if it's the first time the photo has appeared, set the value to one
    }
  }

  // console.log('photos object ->', photosObject)
  const keysSorted = Object.keys(photosObject).sort((a,b) => photosObject[b] - photosObject[a]) //Sort the keys by their values from most to least; End up with the most/least popular photos appearing first in the object
  // console.log('keys sorted ->', keysSorted)
  keysSorted.length = 3

  return keysSorted //Return the object with the three most/least popular photos; keys are the photo urls, and values are the amount of times the photos appear
}

// input swipes, a specific photo, profiles, and whether you are looking for best/worst
// return an object of best/worst comments as keys and number times they appear as values, sorted from most frequent to least frequent
export const mostFrequentComments = (swipes, isBest = true, photo, profiles) => {
  if (photo && photo !== 'undefined') { //if the photo has a url...

    const photosObject = {}
    for (let i = 0; i < swipes.length; i++){ //loop through all swipes
      const profileWithPhoto = profiles.filter(profile => profile.id === swipes[i].swiped_profile_id) //Filter out all profiles except for the one that the swipe corresponds to 
      const imageOnProfile = profileWithPhoto[0].images[isBest ? swipes[i].feedback[0].best_image_index : swipes[i].feedback[0].worst_image_index] //Get the url for best/worst image on the profile

      const imageComments = isBest ? swipes[i].feedback[0].best_image_comments : swipes[i].feedback[0].worst_image_comments // Get the comments for the best/worst image on the profile

      if (photosObject[imageOnProfile]) {
        photosObject[imageOnProfile] = [ ...photosObject[imageOnProfile], ...imageComments ] //If the image url is already a key on the object, push the new set of comments onto the end of the value, which is an array of comments array 
      } else {
        photosObject[imageOnProfile] = [ ...imageComments ] //If this is the first time an image URL is found as a key, set it's value to the array of best/worst comments
      }
    }
    // console.log('photos object ->', photosObject)
    // console.log('specific photo comments ->', photosObject[photo])

    const commentsObject = {}
    for (let i = 0; i < photosObject[photo].length; i++) { //loop through the comments array for the specified photo
      if (commentsObject[photosObject[photo][i]]){
        commentsObject[photosObject[photo][i]] = commentsObject[photosObject[photo][i]] + 1
      } else {
        commentsObject[photosObject[photo][i]] = 1
      }
    } //End up with a comments object, where the key is a good/bad comment, and the value is the number of times it appeared
    // console.log('comments object ->', commentsObject)

    const keysSorted = Object.keys(commentsObject).sort((a,b) => commentsObject[b] - commentsObject[a]) //sorts the comments object so that the most frequent comments appear first

    // console.log('comment keys sorted ->', keysSorted)

    return keysSorted //return an object of best/worst comments as keys and number times they appear as values, sorted from most frequent to least frequent


  } else {

    return ['No Comments', 'No Comments', 'No Comments'] //If photo is undefined, there were no comments on it

  }
}

//Perhaps a totally unnecessary method
export const commentFrequency = (swipes, isBest = true, photo, profiles, comment) => {
  if (photo && photo !== 'undefined' && comment !== 'No Comments') {

    const photosObject = {}
    for (let i = 0; i < swipes.length; i++){
      const profileWithPhoto = profiles.filter(profile => profile.id === swipes[i].swiped_profile_id)
      const imageOnProfile = profileWithPhoto[0].images[isBest ? swipes[i].feedback[0].best_image_index : swipes[i].feedback[0].worst_image_index]

      const imageComments = isBest ? swipes[i].feedback[0].best_image_comments : swipes[i].feedback[0].worst_image_comments

      if (photosObject[imageOnProfile]) {
        photosObject[imageOnProfile] = [ ...photosObject[imageOnProfile], ...imageComments ]
      } else {
        photosObject[imageOnProfile] = [ ...imageComments ]
      }
    }
    // console.log('photos object ->', photosObject)
    // console.log('specific photo comments ->', photosObject[photo])

    const commentsObject = {}
    for (let i = 0; i < photosObject[photo].length; i++) {
      if (commentsObject[photosObject[photo][i]]){
        commentsObject[photosObject[photo][i]] = commentsObject[photosObject[photo][i]] + 1
      } else {
        commentsObject[photosObject[photo][i]] = 1
      }
    }
    // console.log('comments object ->', commentsObject)
    return commentsObject[comment]
  } else {

    return 0
  }

}

// Input all matches and only return the ones where users have opted to exchange social media
export const getSocialMediaMatches = (matchesArray) => {
  return matchesArray.filter(match => match.exchange_social_media)
} 


// Returns a list of the user's profiles
// Called on UserAccount.js
export const getProfilesList = (profilesArray, currentProfileId = 0, handleViewOrGetData) => {
  return (
    <>
      <Stack key={'20'} spacing={0}>
        {profilesArray.map((profile, index) => {
          return (
            <Box key={index}>
              <Box key={index} sx={{ width: 300, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Profile Picture */}
                <Avatar key={profile.id} alt={'profile picture'} src={profile.images ? profile.images[0] : profPicDefault } sx={{ boxShadow: 4, height: 76, width: 76 }} />

                {/* Profile Overall Stats */}
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Typography  key={'20'}>
                    Sample: {profile.swipes.length > 0 ? profile.swipes.length : 0}
                  </Typography>
                  <Typography  key={'21'}>
                    Right Swipes: {profile.swipes.length > 0 ? getRightSwipesNumber(profile.swipes) : 0}
                  </Typography>
                  <Typography  key={'22'}>
                    Percentage: {profile.swipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(profile.swipes), profile.swipes.length) : 0}%
                  </Typography>
                </Box>
                
                {/* Current/Finished labels; view button; analytics button */}
                <Box key={profile.username} sx={{ mt: 1, mb: 1 , height: 76, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  
                  {/* Current/Finished label */}
                  {profile.id === currentProfileId ? 
                    <Typography key={'23'} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Current
                    </Typography>
                    :
                    <Typography key={'24'} sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                      Finished
                    </Typography>
                  }

                  {/* View Profile Button */}
                  <Box onClick={handleViewOrGetData} className={`view ${profile.id}`} sx={{ ml: 0, mr: 0, boxShadow: 0, border: 0, borderRadius: '50%', display: 'flex', alignItems: 'end', justifyContent: 'end' }} >
                    <IconButton aria-label={`${profile.id}`} size="small" >
                      <ChevronRightOutlinedIcon fontSize="small" sx={{ color: profile.id === currentProfileId ? 'primary.main' : 'secondary.main' }} />
                    </IconButton>
                  </Box>
                  {/* View Profile Button */}
                  <Box onClick={handleViewOrGetData} className={`inulytics ${profile.id}`} sx={{ ml: 0, mr: 0, boxShadow: 0, border: 0, borderRadius: '50%', display: 'flex', alignItems: 'end', justifyContent: 'end' }} >
                    <IconButton aria-label={`${profile.id}`} size="small" >
                      <EqualizerIcon fontSize="small" sx={{ color: profile.id === currentProfileId ? 'primary.main' : 'secondary.main' }} />
                    </IconButton>
                  </Box>

                </Box>
              </Box>

              {/* Line at bottom of  */}
              <Divider key={'28'} sx={{ mt: 1, mb: 1 }} />
            </Box>
          )
        })}

      </Stack>
    </>
  )
}


// Overall analytics for all profiles that a user has
// Called in UserAccount.js
export const overallUserAnalyticsHorizontal = (allSwipes) => {

  return (
    <Stack key={'1asd'} spacing={0}>
      <Box key={'1ew'} sx={{ width: 300, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        
        {/* Sample Size */}
        <Box key={'1sdfg'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1hss'} sx={{ textDecoration: 'underline' }}>
            Sample
          </Typography>
          <Typography key={'2areg'}>
            {allSwipes.length > 0 ? allSwipes.length : 0}
          </Typography>
        </Box>
        
        {/* Right Swipes */}
        <Box key={'2arg'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1'} sx={{ textDecoration: 'underline' }}>
            Right Swipes
          </Typography>
          <Typography key={'2hrrj'}>
            {allSwipes.length > 0 ? getRightSwipesNumber(allSwipes) : 0}
          </Typography>
        </Box>
        
        {/* Percentage */}
        <Box key={'3eryj'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography key={'1tyjr'} sx={{ textDecoration: 'underline' }}>
            Percentage
          </Typography>
          <Typography key={'2eyj'}>
            {allSwipes.length > 0 ? getSwipesPercent(getRightSwipesNumber(allSwipes), allSwipes.length) : 0}%
          </Typography>
        </Box>
      </Box>


      {/* Line at bottom of  */}
      <Divider key={'2etr'} sx={{ mt: 2 }} />

    </Stack>
  )
}

// Section of Inulytics where social media matches are linked
// Called in UserAccount.js
export const socialMediaMatches = (matchesArray, userId, profileId, isOverall = true) => {
  
  return (
    <Stack key={'10'} spacing={0}>
      <Box key={'10'} sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center' }}>
        
        {/* Social Media Matches label */}
        <Typography key={'10'} variant='p' sx={{ mt: 1 }} >Social Media Matches: 
          <Typography key={'11'} variant='p' sx={{ ml: 2, fontWeight: 'bold', fontSize: '16px', color: 'primary.main' }} as='span'>
            
            {/* Number is link to social media matches page */}
            <Link key={'12'} to={ isOverall ? `/analytics/profile/${userId}/matches` : `/analytics/profile/${userId}/${profileId}/matches`}>
              { getSocialMediaMatches(matchesArray).length }
            </Link>

          </Typography>
        </Typography>
      </Box>

      {/* Line at bottom of  */}
      <Divider key={'2'} sx={{ mt: 2 }} />
    </Stack>
  )
}

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

// List of social media matches
// Called in SocialMediaMatches.js
export const getMatchesList = (matchedUsersArray, handleViewMatch) => {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start', mt: 0, mb: 2 }}>
        {/* Header */}
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Social Media Matches
        </Typography>
      </Box>
      <Stack key={'20'} spacing={0}>
        {matchedUsersArray.map((user, index) => {
          return (
            <Box key={index}>
              <Box key={index} sx={{ width: 300, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Profile Picture */}
                <Avatar key={user.id} alt={'profile picture'} src={user.profile_image ? user.profile_image : profPicDefault } sx={{ mr: 1, boxShadow: 4, height: 76, width: 76 }} />

                {/* Social Media */}
                <Box key={index} sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <Typography  key={'20'}>
                    Instagram: {user.ig ? user.ig : 'NA'}
                  </Typography>
                  <Typography  key={'21'}>
                    SnapChat: {user.sc ? user.sc : 'NA'}
                  </Typography>
                  <Typography  key={'22'}>
                    Twitter: {user.tw ? user.tw : 'NA'}
                  </Typography>
                </Box>

                {/* View Profile Button */}
                <Box onClick={handleViewMatch} className={`${matchedUsersArray[index].current_profile} ${matchedUsersArray[index].id}`} sx={{ ml: 0, mr: 0, boxShadow: 4, border: 0, borderRadius: '50%', display: 'flex', alignItems: 'end', justifyContent: 'end' }} >
                  <IconButton aria-label={`${matchedUsersArray[index].current_profile}`} size="small" >
                    <ChevronRightOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Line at bottom of  */}
              <Divider key={`${index}-1`} sx={{ mt: 2, mb: 2 }} />
            </Box>
          )
        })}

      </Stack>
    </>
  )
}
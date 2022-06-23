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

// Images
import profPicDefault from '../images/prof-pic-default.png'



// SOCIAL MEDIA MATCHES

// Input all matches and only return the ones where users have opted to exchange social media
export const getSocialMediaMatches = (matchesArray) => {
  return matchesArray.filter(match => match.exchange_social_media)
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


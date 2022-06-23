
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
import profPicDefault from '../images/prof-pic-default.png'

import { getSwipesPercent, getRightSwipesNumber } from './commonSnippets.js'


// PROFILES LIST

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



//mui
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { getSwipesPercent, getRightSwipesNumber } from './commonSnippets.js'


// OVERALL STATISTICS

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
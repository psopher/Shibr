

// pass in sample size of a type of swipe and total number of swipes and retrieve a percentage
export const getSwipesPercent = (sampleSize = 0, totalSwipes = 0) => {
  return (sampleSize / totalSwipes) * 100
}

// Pass in swipes and retrieve the number of right swipes
export const getRightSwipesNumber = (swipesArray) => {
  const rightSwipesArray = swipesArray.filter(swipe => swipe.right_swipe)
  return rightSwipesArray.length
} 

export const findCurrentProfile = (profiles, retrievedUser) => {
  console.log('FIND CURRENT PROFILE RUNS')

  const current = profiles.filter(profile => profile.id === retrievedUser.current_profile)
  

  return current
}
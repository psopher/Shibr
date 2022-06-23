

// pass in sample size of a type of swipe and total number of swipes and retrieve a percentage
const getSwipesPercent = (sampleSize = 0, totalSwipes = 0) => {
  return (sampleSize / totalSwipes) * 100
}

// Pass in swipes and retrieve the number of right swipes
const getRightSwipesNumber = (swipesArray) => {
  const rightSwipesArray = swipesArray.filter(swipe => swipe.right_swipe)
  return rightSwipesArray.length
} 


// Setting profile pic to local storage
export const setProfPicToLocalStorage = (imageURL) => {
  window.localStorage.setItem('profPic', imageURL)
}

// Retrieving profile pic form local storage
export const getProfPicFromLocalStorage = () => {
  return window.localStorage.getItem('profPic')
}

// Setting current profile to local storage
export const setCurrentProfToLocalStorage = (profile) => {
  window.localStorage.setItem('currentProf', JSON.stringify(profile))
}

// Retrieving current profile form local storage
export const getCurrentProfFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem('currentProf'))
}

// Setting user to local storage
export const setUserToLocalStorage = (user) => {
  window.localStorage.setItem('user', user)
}

// Retrieving profile pic form local storage
export const getUserFromLocalStorage = () => {
  return window.localStorage.getItem('user')
}
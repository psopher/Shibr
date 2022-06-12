

// Setting profile pic to local storage
export const setProfPicToLocalStorage = (imageURL) => {
  window.localStorage.setItem('profPic', imageURL)
}

// Retrieving profile pic form local storage
export const getProfPicFromLocalStorage = () => {
  return window.localStorage.getItem('profPic')
}

// Setting user to local storage
export const setUserToLocalStorage = (user) => {
  window.localStorage.setItem('user', user)
}

// Retrieving profile pic form local storage
export const getUserFromLocalStorage = () => {
  return window.localStorage.getItem('user')
}
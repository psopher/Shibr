

// Setting profile pic to local storage
export const setProfPicToLocalStorage = (imageURL) => {
  window.localStorage.setItem('profPic', imageURL)
}

// Retrieving profile pic from local storage
export const getProfPicFromLocalStorage = () => {
  return window.localStorage.getItem('profPic')
}

// Setting current profile to local storage
export const setCurrentProfToLocalStorage = (profile) => {
  window.localStorage.setItem('currentProf', JSON.stringify(profile))
}

// Retrieving current profile from local storage
export const getCurrentProfFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem('currentProf'))
}

// Setting Settings to local storage
export const setSettingsToLocalStorage = (settings) => {
  window.localStorage.setItem('settings', JSON.stringify(settings))
}

// Retrieving settings from local storage
export const getSettingsFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem('settings'))
}
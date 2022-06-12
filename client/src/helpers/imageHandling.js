
export const setProfPicToLocalStorage = (imageURL) => {
  window.localStorage.setItem('profPic', imageURL)
}

export const getProfPicFromLocalStorage = () => {
  return window.localStorage.getItem('profPic')
}
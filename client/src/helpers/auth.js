// ? Gets token from local storage
export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('shibr')
}

// ? Splits the token then returns the payload encoded using base64
export const getPayload = () => {
  const token = getTokenFromLocalStorage()
  if (!token) return
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload))
}

// ? Checks if user is authenticated
export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return false
  const currentTime = Math.floor(Date.now() / 1000)
  return currentTime < payload.exp
}

// ? Checks if payload ID matches owner ID
export const userIsOwner = (singleProfile) => {
  const payload = getPayload()
  if (!payload) return
  return singleProfile.owner === payload.sub
}
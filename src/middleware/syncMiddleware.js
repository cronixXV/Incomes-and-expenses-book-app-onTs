const syncMiddleware = () => (next) => (action) => {
  if (action.type === 'auth/login/fulfilled') {
    const { user, token } = action.payload

    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  } else if (action.type === 'auth/logout/fulfilled') {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return next(action)
}

export default syncMiddleware

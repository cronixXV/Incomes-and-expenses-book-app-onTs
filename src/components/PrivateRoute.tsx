import { Navigate } from 'react-router-dom'

interface PrivateRouteProperties {
  children: React.ReactElement
  authUrl?: string
}
function PrivateRoute({ children, authUrl = '/auth' }: PrivateRouteProperties) {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')

  if (isAuthenticated) {
    return children
  }

  return <Navigate to={authUrl} />
}

export default PrivateRoute

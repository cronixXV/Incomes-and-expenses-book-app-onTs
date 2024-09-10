import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactElement
  authUrl?: string
}
function PrivateRoute({ children, authUrl = '/auth' }: PrivateRouteProps) {
  const isAuthenticated = !!localStorage.getItem('isAuthenticated')

  if (isAuthenticated) {
    return children
  }

  return <Navigate to={authUrl} />
}

export default PrivateRoute

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/authSlice'

export default function Logout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  console.log('isAuthenticated value:', isAuthenticated)

  useEffect(() => {
    console.log('Logout component mounted')
    if (isAuthenticated) {
      console.log('Dispatching logout...')
      dispatch(logout())
    } else {
      console.log('User not authenticated, redirecting...')
      navigate('/auth')
    }
  }, [dispatch, isAuthenticated, navigate])

  return null
}

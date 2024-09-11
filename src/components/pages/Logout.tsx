import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/authSlice'
import { RootState } from '../../store'

export default function Logout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  console.info('isAuthenticated value:', isAuthenticated)

  useEffect(() => {
    console.info('Logout component mounted')
    if (isAuthenticated) {
      console.info('Dispatching logout...')
      dispatch(logout())
    } else {
      console.info('User not authenticated, redirecting...')
      navigate('/auth')
    }
  }, [dispatch, isAuthenticated, navigate])

  return null
}

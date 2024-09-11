import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/authSlice'
import { RootState } from '../../store'

export default function Logout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logout())
    } else {
      navigate('/auth')
    }
  }, [dispatch, isAuthenticated, navigate])

  return null
}

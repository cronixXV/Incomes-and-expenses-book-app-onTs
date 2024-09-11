import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../reducers/authSlice'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { AppDispatch, RootState } from '../../store'

interface LoginPayload {
  email: string
  password: string
}

export default function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [localError, setLocalError] = useState<string>('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    dispatch(login({ email, password } as LoginPayload))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch(() => {
        setLocalError('Неверный email и/или пароль')
        setPassword('')
      })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ maxWidth: '330px' }}
    >
      <div className="text-center">
        <h1 className="h3 mb-4 fw-normal">{t('loginForm.authFormTitle')}</h1>
      </div>

      <Form.Group className="mb-2">
        <Form.Control
          type="email"
          size="lg"
          placeholder={t('loginForm.emailPlaceholder')}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Control
          type="password"
          size="lg"
          placeholder={t('loginForm.passwordPlaceholder')}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>

      {localError && <Alert variant="danger">{localError}</Alert>}

      <Button
        variant="success"
        size="lg"
        type="submit"
        className="w-100"
        disabled={status === 'loading'}
      >
        {t('loginForm.loginButton')}
      </Button>

      <div className="text-center mt-3">
        Еще не зарегистрированы?{' '}
        <Link
          to="/register"
          className="custom-link-reg-log"
        >
          Зарегистрироваться
        </Link>
      </div>
    </Form>
  )
}

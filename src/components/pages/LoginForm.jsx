import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../reducers/authSlice'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { status, error, isAuthenticated } = useSelector((state) => state.auth)
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/')
      })
      .catch((error) => {
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

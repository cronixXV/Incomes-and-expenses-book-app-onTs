import { useState, useEffect, lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/authSlice'
import { AppThemes, ThemeContext } from '../helpers/ThemeContext'
import Error404 from './pages/Error404'
import CheckItem from './CheckItem'
import MainLayout from './layouts/MainLayout'
import CreateCheck, { createCheckAction } from './pages/CreateCheck'
import ErrorBoundary from './ErrorBoundary'
import LoginForm from './pages/LoginForm'
import AuthLayout from './layouts/AuthLayout'
import Logout from './pages/Logout'
import Statistics from './pages/Statistics'
import PrivateRoute from './PrivateRoute'
import RegisterForm from './pages/RegisterForm'

const Main = lazy(() => import('./pages/Main'))
const AllChecks = lazy(() => import('./pages/AllChecks'))
const Settings = lazy(() => import('./Settings'))

const appThemes = [AppThemes.Light, AppThemes.Dark]

const router1 = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          </ErrorBoundary>
        ),
      },
      {
        path: 'incomes',
        element: (
          <PrivateRoute>
            <AllChecks />
          </PrivateRoute>
        ),
      },
      {
        path: 'expenses',
        element: <AllChecks />,
      },
      {
        path: 'create',
        element: <CreateCheck />,
        action: createCheckAction,
      },
      {
        path: 'statistics',
        element: (
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        ),
      },
      {
        path: 'items/:itemId',
        element: <CheckItem />,
        errorElement: (
          <div>Не удалось загрузить чек для пользователя. Попробуйте позже</div>
        ),
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <LoginForm />
          </ErrorBoundary>
        ),
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <RegisterForm />
          </ErrorBoundary>
        ),
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
])

export default function App() {
  const dispatch = useDispatch()
  const [theme, setTheme] = useState<AppThemes>(appThemes[0])

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (isAuthenticated && token && user) {
      dispatch(login({ token, user: JSON.parse(user) }))
    }
  }, [dispatch])

  function changeTheme(theme: AppThemes) {
    if (appThemes.includes(theme)) {
      setTheme(theme)
    }
  }

  function changeThemeNext() {
    const index = appThemes.indexOf(theme) || 0
    setTheme(index === 0 ? appThemes[1] : appThemes[0])
  }

  const themeContextValue: ThemeContextValue = [
    theme,
    setTheme,
    changeTheme,
    changeThemeNext,
  ]

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Suspense fallback={<span>Загрузка...</span>}>
        <RouterProvider router={router1} />
      </Suspense>
    </ThemeContext.Provider>
  )
}

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { BsSpeedometer2 } from 'react-icons/bs'
import { AiOutlineHome, AiOutlineMinusCircle } from 'react-icons/ai'
import { BiAddToQueue } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { IoStatsChartOutline } from 'react-icons/io5'
import { FaRegIdCard } from 'react-icons/fa6'
import styled from 'styled-components'

interface User {
  name?: string
  email?: string
}

const Divider = styled.hr`
  color: white;
  width: 100%;
`

export default function Sidebar() {
  const { t } = useTranslation()
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  })

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  ) as {
    isAuthenticated: boolean
    user: User | null
  }

  const userDisplayName = isAuthenticated
    ? user?.name || user?.email || t('app.menu.guest')
    : t('app.menu.guest')

  return (
    <Navbar
      bg="violet"
      variant="dark"
      style={{ width: '100%', height: isMobile ? 'auto' : '100vh' }}
      className="flex-column flex-shrink-0 p-3"
    >
      <Navbar.Brand
        as={Link}
        to="/"
        className="me-auto"
      >
        <span className="fs-4">{t('app.title')}</span>
      </Navbar.Brand>
      <Divider />

      <Nav
        className="flex-column mb-auto"
        defaultActiveKey="/"
        variant="pills"
        style={{ width: '100%' }}
      >
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/"
            eventKey="/"
            className="text-light px-3"
          >
            <AiOutlineHome
              className="me-2"
              size="16"
            />
            {t('app.menu.main')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/incomes"
            eventKey="/incomes"
            className="text-light px-3"
          >
            <BsSpeedometer2
              className="me-2"
              size="16"
            />
            {t('app.menu.incomes')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/expenses"
            eventKey="/expenses"
            className="text-light px-3"
          >
            <AiOutlineMinusCircle
              className="me-2"
              size="16"
            />
            {t('app.menu.expenses')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/statistics"
            eventKey="/statistics"
            className="text-light px-3"
          >
            <IoStatsChartOutline
              className="me-2"
              size="16"
            />
            {t('app.menu.statistics')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/create"
            eventKey="/create"
            className="text-light px-3"
          >
            <BiAddToQueue
              className="me-2"
              size="16"
            />
            {t('app.menu.create')}
          </Nav.Link>
        </Nav.Item>
        {!isAuthenticated && (
          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/register"
              eventKey="/register"
              className="text-light px-3"
            >
              <FaRegIdCard
                className="me-2"
                size="16"
              />
              {t('app.menu.register')}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>
      <Divider />

      <NavDropdown
        title={
          <>
            <CgProfile
              className="me-2"
              size="32"
            />
            <strong>{userDisplayName}</strong>
          </>
        }
        className="text-light"
        style={{ width: '100%' }}
        drop="up"
        menuVariant="dark"
      >
        {isAuthenticated ? (
          <>
            <NavDropdown.Item
              as={Link}
              to="/settings"
              eventKey="/settings"
            >
              {t('app.menu.settings')}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={Link}
              to="/auth/logout"
              eventKey="/auth/logout"
            >
              {t('app.menu.logout')}
            </NavDropdown.Item>
          </>
        ) : (
          <>
            <NavDropdown.Item
              as={Link}
              to="/settings"
            >
              {t('app.menu.settings')}
            </NavDropdown.Item>
            <NavDropdown.Item
              as={Link}
              to="/auth"
              eventKey="/auth"
            >
              {t('app.menu.login')}
            </NavDropdown.Item>
          </>
        )}
      </NavDropdown>
    </Navbar>
  )
}

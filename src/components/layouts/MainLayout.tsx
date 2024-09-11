import { Container, Row, Col } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from '../Sidebar'

export default function MainLayout() {
  const { t } = useTranslation()
  return (
    <div>
      <main>
        <Container fluid>
          <Row>
            <Col
              sm="12"
              md="4"
              lg="3"
              xxl="2"
              style={{ paddingLeft: 0 }}
            >
              <Sidebar />
            </Col>
            <Col
              sm="12"
              md="8"
              lg="9"
              xxl="10"
            >
              <div className="p-3">
                <Outlet />
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <footer
        style={{ backgroundColor: '#e3e3e3' }}
        className="pt-3"
      >
        <Container fluid>
          <Row>
            <Col>
              <p className="text-center">&copy; {t('app.footer')}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}

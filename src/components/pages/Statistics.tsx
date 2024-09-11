import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchIncomesExpenses,
  IncomesExpensesItem,
} from '../../reducers/incomesExpensesSlice'
import {
  Container,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap'
import moment from 'moment'
import { getCategoryLabel, getTypeLabel } from '../constants/check'
import { useTranslation } from 'react-i18next'
import { RootState } from 'src/store'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'

export default function Statistics() {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>()
  const { data, loading, error } = useSelector(
    (state: RootState) => state.incomesExpenses
  )
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchIncomesExpenses())
  }, [dispatch])

  const filteredData = useMemo(() => {
    if (data && startDate && endDate) {
      return data.filter((item) => {
        const itemDate = moment(item.date)
        return itemDate.isBetween(startDate, endDate, null, '[]')
      })
    }
    return []
  }, [data, startDate, endDate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  const renderTable = () => (
    <Table
      striped
      hover
      variant="light"
      className="mt-4"
    >
      <thead>
        <tr>
          <th>{t('statistics.tableHeaders.title')}</th>
          <th>{t('statistics.tableHeaders.amount')}</th>
          <th>{t('statistics.tableHeaders.type')}</th>
          <th>{t('statistics.tableHeaders.category')}</th>
          <th>{t('statistics.tableHeaders.date')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item: IncomesExpensesItem) => (
          <tr key={item.id}>
            <td>
              <Row>
                <Col>{item.title}</Col>
              </Row>
            </td>
            <td>
              <Row>
                <Col>{item.amount} &#8381;</Col>
              </Row>
            </td>
            <td>
              <Row>
                <Col>{getTypeLabel(item.type)}</Col>
              </Row>
            </td>
            <td>
              <Row>
                <Col>{getCategoryLabel(item.category)}</Col>
              </Row>
            </td>
            <td>
              <Row>
                <Col>{moment(item.date).format('DD.MM.YYYY')}</Col>
              </Row>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner
          animation="border"
          role="status"
          variant="primary"
        >
          <span className="visually-hidden">{t('statistics.loadingData')}</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        {t('statistics.errorFetchingData', { error })}
      </Alert>
    )
  }

  return (
    <Container>
      <h1>{t('statistics.statisticsTitle')}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('statistics.startDateLabel')}</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setStartDate(event.target.value)
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('statistics.endDateLabel')}</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setEndDate(event.target.value)
            }
            required
          />
        </Form.Group>
        <Button
          type="submit"
          className="custom-stats-btn"
        >
          {t('statistics.applyButton')}
        </Button>
      </Form>

      {isSubmitted && filteredData.length === 0 && (
        <Alert
          variant="info"
          style={{ marginTop: '20px' }}
        >
          {t('statistics.noDataForPeriod')}
        </Alert>
      )}

      {filteredData.length > 0 && renderTable()}
    </Container>
  )
}

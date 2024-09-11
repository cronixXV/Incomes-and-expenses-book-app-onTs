import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchIncomesExpensesById } from '../reducers/incomesExpensesSlice'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import moment from 'moment'
import { getCategoryLabel, getTypeLabel } from './constants/check'
import { useTranslation } from 'react-i18next'
import { RootState } from '../store'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'

export default function CheckItem() {
  const { itemId } = useParams<{ itemId: string }>()

  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>()
  const { t } = useTranslation()
  const { data, loading, error } = useSelector((state: RootState) => {
    const item = state.incomesExpenses.data.find(
      (item) => item.id === Number(itemId)
    )
    return {
      data: item,
      loading: state.incomesExpenses.loading,
      error: state.incomesExpenses.error,
    }
  })

  useEffect(() => {
    dispatch(fetchIncomesExpensesById(Number(itemId)))
  }, [dispatch, itemId])

  if (loading || !data) {
    return <div>{t('checkItem.loadingData')}</div>
  }

  if (error) {
    return <div>{t('checkItem.errorFetchingData', { error })}</div>
  }

  return (
    <div>
      <Breadcrumb className="mb-5">
        <Breadcrumb.Item>
          <Link to="/">{t('checkItem.breadcrumbHome')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/incomes">{t('checkItem.breadcrumbAllChecks')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>№ {itemId}</Breadcrumb.Item>
      </Breadcrumb>

      <h2>{data.title}</h2>
      <Table
        striped
        hover
        variant="light"
        className="mt-4"
      >
        <thead>
          <tr>
            <th>{t('checkItem.tableHeaders.title')}</th>
            <th>{t('checkItem.tableHeaders.value')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('checkItem.id')}</td>
            <td>{data.id}</td>
          </tr>
          <tr>
            <td>{t('checkItem.amount')}</td>
            <td>{data.amount}</td>
          </tr>
          <tr>
            <td>{t('checkItem.operationType')}</td>
            <td>{getTypeLabel(data.type)}</td>
          </tr>
          <tr>
            <td>{t('checkItem.category')}</td>
            <td>{getCategoryLabel(data.category)}</td>
          </tr>
          <tr>
            <td>{t('checkItem.creationDate')}</td>
            <td>{moment(data.date).format('DD.MM.YYYY')}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              <h5>{t('checkItem.description')}</h5>
              <p>{data.description}</p>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

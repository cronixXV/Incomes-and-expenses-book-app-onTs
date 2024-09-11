import { useState, useMemo, useEffect } from 'react'
import { Form as RouterForm, useActionData } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { BiAddToQueue } from 'react-icons/bi'
import { TYPE_OPTIONS, CATEGORY_OPTIONS } from '../constants/check'
import useInput from 'Hooks/useInput'
import InputField from '../InputField'
import { useTranslation } from 'react-i18next'
import { IncomesExpensesItem } from '../../reducers/incomesExpensesSlice'

interface CreateCheckFormData extends IncomesExpensesItem {
  isOk?: boolean
  error?: string
}

export default function CreateCheck() {
  const { t } = useTranslation()
  const title = useInput('', 'title', true)
  const amount = useInput('100', 'amount', true)
  const [type, setType] = useState(TYPE_OPTIONS[0].value)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[3].value)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const data = useActionData() as CreateCheckFormData

  const amountText = useMemo(
    () => (
      <Form.Text className="text-muted">
        {t('createCheck.enterAmount')}
      </Form.Text>
    ),
    [t]
  )

  useEffect(() => {
    if (data) {
      if (data.isOk) {
        setModalMessage(t('createCheck.checkAdded'))
      } else if (data.error) {
        setModalMessage(data.error)
      }
      setShowModal(true)
    }
  }, [data, t])

  return (
    <div>
      <h2>{t('createCheck.createNewCheck')}</h2>
      <Form
        as={RouterForm}
        action="/create"
        method="post"
      >
        <InputField
          id="title"
          title={t('createCheck.title')}
          onChange={title.onChange}
          value={title.value}
        />

        <InputField
          id="amount"
          title={t('createCheck.amount')}
          onChange={amount.onChange}
          value={amount.value}
        >
          {amountText}
        </InputField>

        <Form.Group className="mb-3">
          <Form.Label>{t('createCheck.selectType')}</Form.Label>
          <div>
            {TYPE_OPTIONS.map((option) => (
              <Form.Check
                key={option.value}
                inline
                name="type"
                type="radio"
                id={`type-radio-${option.value}`}
                value={option.value}
                label={option.label}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setType(event.target.value)
                }
                checked={type === option.value}
              />
            ))}
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('createCheck.description')}</Form.Label>
          <Form.Control
            as="textarea"
            id="description"
            name="description"
            value={description}
            disabled={title.value.length === 0}
            rows={5}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setDescription(event.target.value)
            }}
          />
          {title.value.length === 0 && (
            <Form.Text className="text-muted">
              {t('createCheck.descriptionAvailableAfterTitle')}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('createCheck.category')}</Form.Label>
          <Form.Select
            id="category"
            name="category"
            value={category}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setCategory(event.target.value)
            }}
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button
          type="submit"
          className="custom-add-btn"
        >
          <BiAddToQueue
            className="me-2"
            size="16"
          />
          {t('createCheck.createCheck')}
        </Button>
      </Form>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('createCheck.notification')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            {t('createCheck.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export const createCheckAction = async ({ request }: { request: Request }) => {
  const data = await request.formData()

  const result = {
    title: data.get('title'),
    description: data.get('description'),
    amount: Number(data.get('amount')),
    type: data.get('type'),
    category: data.get('category'),
  }

  if (
    !result.title ||
    typeof result.title !== 'string' ||
    result.title.trim().length < 5
  ) {
    return { error: 'Название должно содержать более 5 символов' }
  }

  if (
    !result.type ||
    !TYPE_OPTIONS.some((option) => option.value === result.type)
  ) {
    return { error: 'Выберите тип записи' }
  }

  if (
    !result.amount ||
    typeof result.amount !== 'number' ||
    result.amount < 0
  ) {
    return { error: 'Сумма не должна быть отрицательной' }
  }

  try {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/incomes_expenses`, {
      ...result,
      date: new Date(),
    })
    return { isOk: true }
  } catch (error) {
    return { error: 'Ошибка при создании чека' }
  }
}

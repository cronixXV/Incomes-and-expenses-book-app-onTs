import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchIncomesExpenses,
  deleteIncomesExpensesById,
  editIncomesExpensesById,
} from '../../reducers/incomesExpensesSlice'
import {
  Card,
  CardGroup,
  ListGroup,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import { getCategoryLabel } from '../constants/check'
import { useTranslation } from 'react-i18next'

export default function AllChecks() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.incomesExpenses)
  const { t } = useTranslation()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    description: '',
    category: '',
  })

  useEffect(() => {
    dispatch(fetchIncomesExpenses())
  }, [dispatch])

  const handleDelete = (id) => {
    setSelectedItemId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    dispatch(deleteIncomesExpensesById(selectedItemId))
    setShowDeleteModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleEdit = (item) => {
    setEditFormData({
      title: item.title,
      amount: item.amount,
      description: item.description || '',
      category: item.category,
    })
    setSelectedItemId(item.id)
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const confirmEdit = () => {
    dispatch(editIncomesExpensesById(selectedItemId, editFormData))
    setShowEditModal(false)
  }

  const cancelEdit = () => {
    setShowEditModal(false)
  }

  const handleDetails = (item) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner
          animation="border"
          role="status"
          variant="primary"
        >
          <span className="visually-hidden">{t('allChecks.loadingData')}</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {t('allChecks.errorFetchingData')}: {error}
      </div>
    )
  }

  return (
    <div>
      <h1>{t('allChecks.allChecks')}</h1>
      <CardGroup as="div">
        {data.map((item) => (
          <div
            key={item.id}
            className="p-3 col-sm-12 col-md-6 col-lg-4 col-xxl-3"
          >
            <Card>
              <Card.Body>
                <Card.Title>№ {item.id}</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>{item.title}</ListGroup.Item>
                  <ListGroup.Item>
                    {t('allChecks.category')}: {getCategoryLabel(item.category)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {t('allChecks.amount')}: {item.amount}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      variant="link"
                      onClick={() => handleDetails(item)}
                      className="custom-link"
                      size="sm"
                    >
                      {t('allChecks.details')}
                    </Button>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="button-container">
                      <Button
                        className="custom-edit-btn"
                        onClick={() => handleEdit(item)}
                        size="sm"
                      >
                        {t('allChecks.edit')}
                      </Button>
                      <Button
                        className="custom-delete-btn"
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                      >
                        {t('allChecks.delete')}
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        ))}
      </CardGroup>

      <Modal
        show={showDeleteModal}
        onHide={cancelDelete}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('allChecks.confirmDeletion')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('allChecks.confirmDeleteMessage')}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cancelDelete}
            size="md"
          >
            {t('allChecks.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            size="md"
          >
            {t('allChecks.delete')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={cancelEdit}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('allChecks.editCheck')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('allChecks.title')}</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('allChecks.amount')}</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={editFormData.amount}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('allChecks.description')}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('allChecks.category')}</Form.Label>
              <Form.Select
                name="category"
                value={editFormData.category}
                onChange={handleEditChange}
              >
                <option value="food">{t('allChecks.food')}</option>
                <option value="electronics">
                  {t('allChecks.electronics')}
                </option>
                <option value="fun">{t('allChecks.fun')}</option>
                <option value="other">{t('allChecks.other')}</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cancelEdit}
            size="md"
          >
            {t('allChecks.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={confirmEdit}
            size="md"
          >
            {t('allChecks.saveChanges')}
          </Button>
        </Modal.Footer>
      </Modal>

      {selectedItem && (
        <Modal
          show={showDetailModal}
          onHide={closeDetailModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {t('allChecks.checkDetails')} № {selectedItem.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {t('allChecks.title')}: {selectedItem.title}
            </p>
            <p>
              {t('allChecks.amount')}: {selectedItem.amount} &#8381;
            </p>
            <p>
              {t('allChecks.description')}:{' '}
              {selectedItem.description || t('allChecks.noDescription')}
            </p>
            <p>
              {t('allChecks.category')}:{' '}
              {getCategoryLabel(selectedItem.category)}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeDetailModal}
              size="sm"
            >
              {t('allChecks.close')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  )
}

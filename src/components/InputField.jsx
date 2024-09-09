import React from 'react'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'

function InputField({
  id,
  title,
  onChange,
  value = '',
  type = 'text',
  children,
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Control
        id={id}
        name={id}
        type={type}
        placeholder={title}
        value={value}
        onChange={onChange}
      />

      {children}
    </Form.Group>
  )
}

InputField.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string.isRequired,
}

export default React.memo(InputField)

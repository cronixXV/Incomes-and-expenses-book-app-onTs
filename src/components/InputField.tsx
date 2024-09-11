import React from 'react'
import Form from 'react-bootstrap/Form'

interface InputFieldProps {
  id: string
  title: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number
  type?: string
  children?: React.ReactElement
}

function InputField({
  id,
  title,
  onChange,
  value = '',
  type = 'text',
  children,
}: InputFieldProps) {
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

export default React.memo(InputField)

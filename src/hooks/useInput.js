import { useState, useCallback } from 'react'

export default function useInput(
  defaultValue = '',
  name = '',
  required = false
) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState(null)

  const onChange = useCallback((event) => setValue(event.target.value), [])

  return {
    id: name,
    name,
    value,
    error,
    onBlur: (event) => {
      setError(
        !event.target.value && required
          ? 'Поле обязательно для заполнения'
          : null
      )
    },
    onChange: onChange,
  }
}

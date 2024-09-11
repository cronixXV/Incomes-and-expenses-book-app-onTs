import { useState, useCallback, FocusEvent, ChangeEvent } from 'react'

export default function useInput(
  defaultValue = '',
  name = '',
  required = false
) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
    []
  )

  return {
    id: name,
    name,
    value,
    error,
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      setError(
        !event.target.value && required
          ? 'Поле обязательно для заполнения'
          : null
      )
    },
    onChange: onChange,
  }
}

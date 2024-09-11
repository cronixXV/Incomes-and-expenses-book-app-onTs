import { useState, useEffect } from 'react'

interface Data {
  loading: boolean
  data: string | null
  error: string | null
}

export default function useFetch(url: string, options: RequestInit) {
  const [data, setData] = useState<Data>({
    loading: false,
    data: null,
    error: null,
  })

  function getData(url: string, options: RequestInit) {
    setData({ loading: true, data: null, error: null })
    fetch(url, options)
      .then((result) => result.json())
      .then((result) => {
        setData({ loading: false, data: result, error: null })
      })
      .catch((error) => {
        setData({ loading: false, data: null, error })
      })
  }

  useEffect(() => {
    if (url) {
      getData(url, options)
    }
  }, [])

  return { ...data, getData }
}

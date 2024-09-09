import { useState, useEffect } from 'react'

export default function useFetch(url, options) {
  const [data, setData] = useState({
    loading: false,
    data: null,
    error: null,
  })

  function getData(url, options) {
    setData({ loading: true })
    fetch(url, options)
      .then((result) => result.json())
      .then((result) => {
        setData({ loading: false, data: result })
      })
      .catch((error) => {
        setData({ loading: false, error })
      })
  }

  useEffect(() => {
    if (url) {
      getData(url, options)
    }
  }, [])

  return { ...data, getData }
}

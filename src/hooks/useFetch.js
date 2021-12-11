import { useEffect, useState } from 'react'

const useFetch = (request, options) => {
  const { enabled = true } = options || {}
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
    data: null,
    error: null,
  })

  const fetchRequest = (...args) => {
    setState((old) => ({
      ...old,
      isLoading: true,
    }))
    request(...args)
      .then((res) => {
        setState((old) => ({
          ...old,
          data: res,
        }))
      })
      .catch((err) => {
        setState((old) => ({
          ...old,
          error: err,
        }))
      })
      .finally(() => {
        setState((old) => ({
          ...old,
          isLoading: false,
        }))
      })
  }
  useEffect(() => {
    if (enabled && request) {
      fetchRequest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return {
    ...state,
    refetch: fetchRequest,
  }
}
export default useFetch

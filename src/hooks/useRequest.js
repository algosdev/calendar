import { useState } from 'react'

const useRequest = (request, options) => {
  const {
    onStart = () => {},
    onSuccess = () => {},
    onError = () => {},
    onSettled = () => {},
  } = options || {}
  const [state, setState] = useState({
    isLoading: false,
    isError: false,
  })

  const fetch = (...args) => {
    onStart()
    setState((old) => ({
      ...old,
      isLoading: true,
    }))
    request(...args)
      .then((res) => {
        onSuccess(res)
      })
      .catch((err) => {
        onError(err)
      })
      .finally(() => {
        setState((old) => ({
          ...old,
          isLoading: false,
        }))
        onSettled()
      })
  }
  return {
    mutate: fetch,
    isLoading: state.isLoading,
    isError: state.isError,
  }
}
export default useRequest

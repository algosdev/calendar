import { useRef, useState } from 'react'

export default function useForm(options) {
  const {
    defaultValues,
    onSubmit = () => {},
    onError = () => {},
  } = options || {}
  const [state, setState] = useState({
    data: defaultValues || {},
    formState: {
      isValid: true,
    },
  })
  const registeredFields = useRef([])
  const validateForm = () => {
    const result = {}
    const values = Object.values(state.data)
    const invalidValues = ['', undefined, null]
    const areValid = values.every((el) => {
      if (el.required) {
        return !invalidValues.includes(el.value)
      }
      return true
    })
    if (areValid) {
      result.success = true
      const onlyValues = Object.entries(state.data).reduce(
        (init, [key, { value, isInteger }]) => {
          init[key] = isInteger ? parseInt(value) : value
          return init
        },
        {}
      )
      result.values = onlyValues
    } else {
      result.errors = {}
    }
    return result
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateForm()
    if (validation.success) {
      onSubmit(validation.values)
      return
    }
    onError(validation.errors)
  }
  const setValue = (name, value) => {
    setState((old) => ({
      ...old,
      data: {
        ...old.data,
        [name]: {
          ...old.data[name],
          value: value,
        },
      },
    }))
  }
  const reset = () => {
    setState((old) => {
      const resettedValues = Object.entries(old.data)?.reduce(
        (init, [key, properties]) => {
          init[key] = { ...properties, value: properties.defaultValue }
          return init
        },
        {}
      )
      return {
        ...old,
        data: resettedValues,
      }
    })
  }
  const setValues = (values) => {
    setState((old) => {
      const entries = Object.entries(old.data)
      const newValues = entries?.reduce((init, [key, el]) => {
        init[key] = {
          ...el,
          ...(key in values && { value: values?.[key] }),
        }
        return init
      }, {})
      return {
        ...old,
        data: {
          ...newValues,
        },
      }
    })
  }
  const register = (name, options) => {
    if (!registeredFields.current.includes(name)) {
      const { defaultValue = null, required, validate, isInteger } = options
      setState((old) => ({
        ...old,
        data: {
          ...old.data,
          [name]: {
            isInteger: Boolean(isInteger),
            value: defaultValue,
            defaultValue,
            required: Boolean(required),
            validate,
          },
        },
      }))
      registeredFields.current.push(name)
    }

    return {
      value: state.data?.[name]?.value || null,
      onChange: (value) => {
        setValue(name, value)
      },
    }
  }
  return {
    register,
    handleSubmit,
    formState: state.formState,
    setValues,
    setValue,
    reset,
  }
}

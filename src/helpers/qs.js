export default function queryStringify(obj, options = {}) {
  const { addQueryPrefix = true } = options
  const entries = Object.entries(obj)
  const result = entries.reduce((str, [key, value], index) => {
    const query = [undefined, null, ''].includes(value)
      ? ''
      : `${index ? '&' : ''}${key}=${value}`
    str += query
    return str
  }, '')
  return `${addQueryPrefix ? '?' : ''}${result}`
}

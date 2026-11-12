const formatErrorMessage = (value) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value.map(formatErrorMessage).filter(Boolean).join(', ')
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, detail]) => {
        const message = formatErrorMessage(detail)
        return message ? `${key}: ${message}` : ''
      })
      .filter(Boolean)
      .join(', ')
  }
  return ''
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  const response = error?.response
  const responseData = response?.data
  const message = formatErrorMessage(responseData?.message)
    || formatErrorMessage(responseData?.error)
    || formatErrorMessage(error?.message)

  return message || fallback
}

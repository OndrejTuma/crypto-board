import { useState, useEffect } from 'react'

function getDefaultValue(key, defaultValue) {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  const value = localStorage.getItem(key)

  return value ? JSON.parse(value) : defaultValue
}

const useLocalStorage = (key, defaultValue) => {
  const [value, set] = useState(getDefaultValue(key, defaultValue))

  useEffect(() => {
    const value = localStorage.getItem(key)

    if (!value) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
    }
  }, [])

  const setValue = newValue => {
    let usedValue = newValue

    if (typeof newValue === 'function') {
      usedValue = newValue(value)
    }

    localStorage.setItem(key, JSON.stringify(usedValue))
    set(usedValue)
  }

  return [value, setValue]
}

export default useLocalStorage
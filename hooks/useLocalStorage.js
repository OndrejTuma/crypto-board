import { useState, useEffect } from 'react'

const useLocalStorage = (key, defaultValue) => {
  const [value, set] = useState(defaultValue)

  useEffect(() => {
    const value = localStorage.getItem(key)

    if (value) {
      set(JSON.parse(value))
    } else {
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
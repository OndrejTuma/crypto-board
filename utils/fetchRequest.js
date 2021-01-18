async function fetchRequest(request) {
  try {
    const response = await fetch(request)

    if (response.status >= 400) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (e) {
    return {
      error: true,
      errorMessage: e.message,
    }
  }
}

export default fetchRequest
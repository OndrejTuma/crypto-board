async function fetchRequest(request) {
  try {
    return await fetch(request).then(res => res.json())
  } catch (e) {
    return {
      error: true,
      errorMessage: 'Nepodařilo se získat data',
    }
  }
}

export default fetchRequest
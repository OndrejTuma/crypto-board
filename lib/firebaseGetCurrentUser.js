import Cookies from 'js-cookie'

import firebaseCookieName from '../consts/firebaseCookieName'

const firebaseGetCurrentUser = async () => {
  const token = Cookies.get(firebaseCookieName)

  try {
    const response = await fetch('/api/firebase/authUid', {
      method: 'POST',
      body: token,
    })
    const data = await response.json()

    if (data.error) {
      console.error(data.error)

      return
    }

    return data
  } catch (e) {
    alert(e.message)
  }
}

export default firebaseGetCurrentUser
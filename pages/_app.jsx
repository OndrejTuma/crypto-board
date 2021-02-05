import { useEffect, useState } from 'react'

import { AuthContext } from '../store/AuthContext'
import firebaseGetCurrentUser from '../lib/firebaseGetCurrentUser'

import '../styles/globals.css'
import firebaseInit from '../lib/firebaseInit'

function MyApp({ Component, pageProps }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)

  const authProviderValue = {
    isLogged,
    user,
    logIn: user => {
      setIsLogged(true)
      setUser(user)
    },
    logOut: () => {
      setIsLogged(false)
      setUser(null)
    }
  }

  useEffect(() => {
    firebaseInit()

    const user = firebaseGetCurrentUser()
    if (user) {
      setIsLogged(true)
      setUser(user)
    }
  }, [isLogged])

  return (
    <AuthContext.Provider value={authProviderValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp

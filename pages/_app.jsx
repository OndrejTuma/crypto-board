import React, { useCallback, useState } from 'react'
import Cookies from 'js-cookie'

import { AuthContext } from '../store/AuthContext'
import firebaseCookieName from '../consts/firebaseCookieName'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)

  const logIn = useCallback(user => {
    setIsLogged(true)
    setUser(user)

    // if logIn is called from useAuth, it returns only uid (data) and not functionality
    if (user.getIdToken) {
      user.getIdToken().then(token => Cookies.set(firebaseCookieName, token))
    }
  }, [])
  const logOut = useCallback(() => {
    setIsLogged(false)
    setUser(null)

    Cookies.remove(firebaseCookieName)
  }, [])

  const authProviderValue = {
    isLogged,
    user,
    logIn,
    logOut,
  }

  console.count('APP')

  return (
    <AuthContext.Provider value={authProviderValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp

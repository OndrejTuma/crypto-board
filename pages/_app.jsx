import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { AuthContext } from '../store/AuthContext'
import firebaseGetCurrentUser from '../lib/firebaseGetCurrentUser'
import firebaseInit from '../lib/firebaseInit'
import firebaseCookieName from '../consts/firebaseCookieName'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)

  const authProviderValue = {
    isLogged,
    user,
    logIn: async user => {
      setIsLogged(true)
      setUser(user)

      user.getIdToken().then(token => Cookies.set(firebaseCookieName, token))
    },
    logOut: () => {
      setIsLogged(false)
      setUser(null)
    },
  }

  useEffect(() => {
    firebaseInit()

    firebaseGetCurrentUser().then(user => {
      if (user) {
        setIsLogged(true)
        setUser(user)
      }
    })
  }, [isLogged])

  return (
    <AuthContext.Provider value={authProviderValue}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  )
}

export default MyApp

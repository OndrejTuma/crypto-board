import { useContext, useEffect, useState } from 'react'

import { AuthContext } from '../store/AuthContext'
import firebaseInit from '../lib/firebaseInit'
import firebaseGetCurrentUser from '../lib/firebaseGetCurrentUser'

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const auth = useContext(AuthContext)

  firebaseInit()

  useEffect(() => {
    firebaseGetCurrentUser()
      .then(user => user ? auth.logIn(user) : auth.logOut())
      .finally(() => setIsLoading(false))
  }, [])

  return {
    isLoading,
    isLogged: auth.isLogged,
    logIn: auth.logIn,
    logOut: auth.logOut,
  }
}

export default useAuth
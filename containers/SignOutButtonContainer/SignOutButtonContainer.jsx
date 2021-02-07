import React from 'react'
import { useRouter } from 'next/router'

import firebaseSignOut from '../../lib/firebaseSignOut'
import useAuth from '../../hooks/useAuth'

const SignOutButtonContainer = () => {
  const auth = useAuth()
  const router = useRouter()

  const signOut = async () => {
    try {
      await firebaseSignOut()

      auth.logOut()

      await router.push('/auth')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <button onClick={signOut}>Logout</button>
  )
}

export default SignOutButtonContainer
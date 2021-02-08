import React from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'

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
    <Button variant={'outlined'} color={'primary'} onClick={signOut}>Logout</Button>
  )
}

export default SignOutButtonContainer
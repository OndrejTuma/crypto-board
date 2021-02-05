import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import firebaseAuth from '../../lib/firebaseAuth'
import { AuthContext } from '../../store/AuthContext'

const LoginFormContainer = () => {
  const auth = useContext(AuthContext)
  const router = useRouter()

  const onSubmit = async ({ email, password }, { setSubmitting }) => {
    try {
      const { user } = await firebaseAuth(email, password)

      auth.logIn(user)

      router.push('/')
    } catch (e) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="email" name="email"/>
          <ErrorMessage name="email" component="div"/>
          <Field type="password" name="password"/>
          <ErrorMessage name="password" component="div"/>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginFormContainer
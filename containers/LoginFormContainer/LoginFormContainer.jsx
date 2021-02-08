import React from 'react'
import { useRouter } from 'next/router'
import { Formik, Form, Field } from 'formik'
import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'

import Input from '../../components/Input'
import firebaseAuth from '../../lib/firebaseAuth'
import useAuth from '../../hooks/useAuth'

const LoginFormContainer = () => {
  const auth = useAuth()
  const router = useRouter()

  const onSubmit = async ({ email, password }, { setSubmitting }) => {
    console.log(email, password)
    try {
      const { user } = await firebaseAuth(email, password)

      await auth.logIn(user)

      await router.push('/')
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
          <Grid container spacing={3}>
            <Grid item>
              <FormLabel required>Email:</FormLabel>
              <Field component={Input} type="email" name="email"/>
            </Grid>
            <Grid item>
              <FormLabel required>Password:</FormLabel>
              <Field component={Input} type="password" name="password"/>
            </Grid>
            <Grid item>
              <Button variant={'contained'} color={'primary'} type={'submit'} disabled={isSubmitting}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default LoginFormContainer
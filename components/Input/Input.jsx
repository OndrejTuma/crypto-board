import React from 'react'
import MuiInput from '@material-ui/core/Input'
import { ErrorMessage } from 'formik'

const Input = ({ field, form, meta, ...rest }) => (
  <>
    <MuiInput {...field} {...rest}/>
    <ErrorMessage name={field.name} component={'div'} />
  </>
)

export default Input
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Box from '@material-ui/core/Box'
import FormLabel from '@material-ui/core/FormLabel'
import Chip from '@material-ui/core/Chip'

import Input from '../../../components/Input'

const CurrenciesSelectorContainer = ({ currencySelector, beforeAdd, beforeDelete }) => {
  const [currencies, setCurrencies] = currencySelector

  const handleDeleteChip = currency => () => {
    beforeDelete?.(currency)
    setCurrencies(currencies => currencies.filter(name => name !== currency))
  }
  const handleAddCurrency = ({ newCurrency }, { resetForm }) => {
    const currency = newCurrency.toUpperCase()

    if (!currencies.includes(currency)) {
      beforeAdd?.(currency)
      setCurrencies(currencies => [...currencies, currency])
    }

    resetForm()
  }

  return (
    <Box my={3}>
      <Formik
        initialValues={{
          newCurrency: '',
        }}
        onSubmit={handleAddCurrency}
      >
        {() => (
          <Form>
            <FormLabel>Selected currencies:</FormLabel>
            {currencies.map(currency => (
              <Box key={currency} component={'span'} mx={1}>
                <Chip label={currency} onDelete={handleDeleteChip(currency)} color="primary"/>
              </Box>
            ))}
            <Field component={Input} type={'input'} name={'newCurrency'} placeholder={'add currency'}/>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CurrenciesSelectorContainer
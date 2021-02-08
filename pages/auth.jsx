import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import LoginFormContainer from '../containers/LoginFormContainer'

export default function Auth() {
  return (
    <Box my={10}>
      <Grid container justify={'center'}>
        <LoginFormContainer/>
      </Grid>
    </Box>
  )
}
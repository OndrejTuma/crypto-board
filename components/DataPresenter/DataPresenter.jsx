import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

const DataPresenter = (
  {
    children,
    data,
    loader = <CircularProgress/>,
    transformData = data => data,
  },
) => {
  if (!data) {
    return loader
  }

  if (data.error) {
    return <Typography component={'h3'} variant={'h2'}>{data.errorMessage || 'Error occured'}</Typography>
  }

  return typeof children === 'function' ? children(transformData(data)) : children
}

export default DataPresenter
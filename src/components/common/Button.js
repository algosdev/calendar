import React from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'
export default function Button({ children, isLoading, sx, ...rest }) {
  return (
    <MuiButton
      {...rest}
      sx={{
        height: 48,
        ...sx,
      }}
    >
      {isLoading ? <CircularProgress color='inherit' size={20} /> : children}
    </MuiButton>
  )
}

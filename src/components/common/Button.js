import React from 'react'
import { Button as MuiButton, CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles({
  root: {
    background: '#0170fe',
  },
})
export default function Button({ children, isLoading, sx, ...rest }) {
  const cls = useStyles()
  return (
    <MuiButton
      {...rest}
      sx={{
        height: 48,
        background: '#0170fe',
        ...sx,
      }}
      className={cls.root}
    >
      {isLoading ? <CircularProgress color='inherit' size={20} /> : children}
    </MuiButton>
  )
}

import { TextField } from '@mui/material'
import React from 'react'

export default function Input({ type, sx, onChange, ...props }) {
  return (
    <TextField
      variant='outlined'
      inputProps={
        type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}
      }
      type={type}
      sx={{
        marginTop: 1,
        ...sx,
      }}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  )
}

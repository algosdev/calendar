import { TextField } from '@mui/material'
import React from 'react'

export default function Input({ type, sx, onChange, value, ...props }) {
  return (
    <TextField
      variant='outlined'
      inputProps={
        type === 'number' ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}
      }
      InputLabelProps={{ shrink: !!value }}
      type={type}
      sx={{
        marginTop: 1,
        ...sx,
      }}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      {...props}
    />
  )
}

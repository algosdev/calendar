import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

export default function Select({ label, onChange, ...rest }) {
  return (
    <Autocomplete
      disablePortal
      sx={{
        marginTop: 2,
      }}
      onChange={(e, val) => onChange(val)}
      {...rest}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}

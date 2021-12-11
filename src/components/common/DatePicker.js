import { LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import React from 'react'
import { DatePicker as MuiDatePicker } from '@mui/lab'
import { TextField } from '@mui/material'

export default function DatePicker({ placeholder, sx, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        renderInput={(props) => (
          <TextField
            {...props}
            sx={{
              width: '100%',
              ...sx,
            }}
            placeholder={placeholder}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  )
}

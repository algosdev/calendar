import { LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import React from 'react'
import { DatePicker as MuiDatePicker } from '@mui/lab'
import { TextField } from '@mui/material'
import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import arSaLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
const localeMap = {
  en: enLocale,
  fr: frLocale,
  ru: ruLocale,
  ar: arSaLocale,
};
export default function DatePicker({ placeholder, sx, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap.ru}>
      <MuiDatePicker
      for
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

import { LocalizationProvider, MobileDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import React, { useState } from 'react'
import { DatePicker as MuiDatePicker } from '@mui/lab'
import {  TextField } from '@mui/material'
import {makeStyles} from '@mui/styles'
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
const useStyles = makeStyles({
  root: {
    "& .MuiInputAdornment-root > button":{
      position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    borderRadius: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    }
  }
})
export default function DatePicker({ placeholder, sx, ...props }) {
  const cls = useStyles()
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap.ru}>
        {/* <MobileDatePicker
          label="Date mobile"
          inputFormat="dd/MM/yyyy"
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
        /> */}
      <MuiDatePicker
      for
        renderInput={(props) => (
         <TextField
            {...props}
            sx={{
              width: '100%',
              ...sx,
            }}
            className={cls.root}
            placeholder={placeholder}
          />
        )}
        {...props}
      />
     </LocalizationProvider>
  )
}

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import { Button, Drawer, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'

export default function AddEventDrawer({ open, setOpen, onSubmit }) {
  const [values, setValues] = useState({
    title: '',
    start: null,
    end: null,
    backgroundColor: "#ff0000"
  })
  useEffect(() => {
    if(open === false){
      setValues({
        backgroundColor: "#ff0000",
        start: null,
        end: null,
      })
    } else if(open.id){
      setValues(open)
    }
  }, [open])
  
  return (
    <Drawer anchor={'left'} open={Boolean(open)} onClose={() => setOpen(false)}>
      <Box p={4} display='flex' flexDirection='column'>
        <Typography>{open?.id ? "Update" : "Add"} event</Typography>
        <Box display='flex' flexDirection='column'>
          <TextField
            sx={{
              marginTop: 1,
            }}
            value={values.title}
              onChange={(e) => {
                setValues({ ...values, title: e.target.value })
              }}
            placeholder='Name'
          />
          <Box my={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => (
                <TextField {...props} placeholder='Start' />
              )}
              label='Start'
              value={values.start}
              onChange={(newValue) => {
                setValues({ ...values, start: newValue })
              }}
            />
          </LocalizationProvider>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={(props) => (
                <TextField {...props} placeholder='End' />
              )}
              label='End'
              value={values.end}
              onChange={(newValue) => {
                setValues({ ...values, end: newValue })
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box my={1}>
            <input type='color' onChange={(e) => {
             setValues({...values, backgroundColor: e.target.value})}} value={values.backgroundColor} />
         </Box>
        <Box mt={2}>
            <Button fullWidth variant='contained' onClick={() => onSubmit(values)}>
            {open?.id ? "Update" : "Add"}
            </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

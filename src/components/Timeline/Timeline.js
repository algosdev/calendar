import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Chrono } from 'react-chrono'
import data from './data'
export default function Timeline() {
  return (
    <Box p={4}>
      <Typography variant='h5'>Container TY-O89</Typography>
      <Box my={3}>
        <Chrono items={data} mode='HORIZONTAL' />
      </Box>
    </Box>
  )
}

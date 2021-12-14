import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { format } from 'almoment'
import Button from './common/Button'
export default function Comment({ data, trains, onEdit }) {
  return (
    <Box
      sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}
    >
      <Box>
        <Typography>
          Train:{' '}
          <b>{trains?.find((el) => el.train_id === data?.train_id)?.name}</b>
        </Typography>
        <Typography>
          Message: <b>{data.message}</b>
        </Typography>
        <Typography>
          Issue date: <b>{format(data?.issue_date, 'YYYY.MM.DD')}</b>
        </Typography>
        <Typography>
          Updated at: <b>{format(data?.updated_at, 'YYYY.MM.DD hh:mm:ss')}</b>
        </Typography>
      </Box>
      <Button variant='contained' onClick={() => onEdit(data)}>
        Edit
      </Button>
    </Box>
  )
}

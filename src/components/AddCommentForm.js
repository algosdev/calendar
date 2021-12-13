import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import useForm from '../hooks/useForm'
import useRequest from '../hooks/useRequest'
import requests from '../requests'
import Button from './common/Button'
import Input from './common/Input'
import { format } from 'almoment'
import DatePicker from './common/DatePicker'

export default function AddCommentForm({ trainId, afterSubmit }) {
  const [open, setOpen] = useState(false)
  const { mutate: create, isLoading: isUpdating } = useRequest(
    requests.comment.create,
    {
      onSuccess(res) {
        toast.success('Created successfully!')
        setOpen(false)
        afterSubmit()
      },
    }
  )
  const { register, handleSubmit } = useForm({
    onSubmit,
    onError,
  })
  function onSubmit(data) {
    const requestBody = {
      issue_date: format(data?.issue_date, 'YYYY-MM-DD'),
      message: data?.message,
      train_id: trainId,
    }
    console.log('requestBody', requestBody)
    create(requestBody)
  }
  function onError(data) {
    toast.error('Please, fill in all fields')
  }
  return (
    <>
      {open ? (
        <form onSubmit={handleSubmit}>
          <Box p={4} pt={0} display='flex' flexDirection='column'>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Add comment
            </Typography>
            <DatePicker
              label='Issue date'
              {...register('issue_date', {
                required: true,
              })}
            />
            <Box mt={1}>
              <Input
                label='Message'
                multiline
                rows={4}
                sx={{
                  width: '100%',
                }}
                {...register('message', {
                  defaultValue: '',
                  required: true,
                })}
              />
              <Box mt={2}>
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  isLoading={isUpdating}
                  // onClick={() => mutate(values)}
                >
                  Add comment
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      ) : (
        <Box px={4}>
          <Button
            fullWidth
            variant='contained'
            type='submit'
            onClick={() => setOpen(true)}
          >
            Add comment
          </Button>
        </Box>
      )}
    </>
  )
}

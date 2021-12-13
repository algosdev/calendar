import DatePicker from './common/DatePicker'
import { Drawer, Typography } from '@mui/material'
import Input from './common/Input'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import React, { useEffect } from 'react'
import Select from './common/Select'
import Button from './common/Button'
import useRequest from '../hooks/useRequest'
import requests from '../requests'
import { format } from 'almoment'
import useForm from '../hooks/useForm'
import { toast } from 'react-toastify'
const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      width: '40vw',
    },
  },
})

export default function AddCommentDrawer({
  open,
  setOpen,
  afterSubmit,
  trains,
  currentDate,
}) {
  const cls = useStyles()
  const isUpdate = open
  const { mutate, isLoading } = useRequest(requests.comment.create, {
    onSuccess(res) {
      toast.success('Created successfully!')
      setOpen(false)
      afterSubmit()
    },
  })

  const { mutate: update, isLoading: isUpdating } = useRequest(
    requests.comment.update,
    {
      onSuccess(res) {
        toast.success('Updated successfully!')
        setOpen(false)
        afterSubmit()
      },
    }
  )
  const { register, handleSubmit, reset, setValues, setValue } = useForm({
    onSubmit,
    onError,
  })
  function onSubmit(data) {
    const requestBody = {
      issue_date: format(data?.issue_date, 'YYYY-MM-DD'),
      message: data?.message,
      train_id: data?.train?.train_id,
    }
    console.log('requestBody', requestBody)
    if (open?.comment_id) {
      update(open?.comment_id, requestBody)
      return
    }
    mutate(requestBody)
  }
  function onError(data) {
    toast.error('Please, fill in all fields')
  }

  useEffect(() => {
    if (!open) {
      reset()
    } else {
      setValue('issue_date', currentDate)
    }
  }, [open])
  useEffect(() => {
    if (isUpdate?.comment_id) {
      const formatted = {
        issue_date: open?.issue_date,
        message: open?.message,
        train: {
          ...trains?.data?.trains?.find((el) => el.train_id === open.train_id),
          label: trains?.data?.trains?.find(
            (el) => el.train_id === open.train_id
          )?.name,
        },
      }
      setValues(formatted)
    }
  }, [isUpdate])
  return (
    <Drawer
      anchor={'right'}
      className={cls.root}
      open={Boolean(open)}
      onClose={() => setOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <Box p={4} display='flex' flexDirection='column'>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 600,
              mb: 2,
            }}
          >
            {isUpdate?.comment_id ? 'Update' : 'Add'} comment
          </Typography>
          <Box display='flex' flexDirection='column'>
            <Select
              label='Train'
              options={
                trains?.data?.trains?.map((el) => ({
                  ...el,
                  label: el.name,
                })) || []
              }
              {...register('train', {
                required: true,
              })}
            />
            <Box mt={2} display='flex'>
              <DatePicker
                label='Issue date'
                {...register('issue_date', {
                  required: true,
                  defaultValue: currentDate,
                })}
              />
            </Box>
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
            </Box>
          </Box>
          <Box mt={2}>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              isLoading={isLoading || isUpdating}
            >
              {isUpdate ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  )
}

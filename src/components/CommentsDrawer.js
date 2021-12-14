import DatePicker from './common/DatePicker'
import { Drawer, Typography } from '@mui/material'
import Input from './common/Input'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'
import React, { useEffect } from 'react'
import Select from './common/Select'
import ColorPicker from './common/ColorPicker'
import Button from './common/Button'
import useRequest from '../hooks/useRequest'
import requests from '../requests'
import { format } from 'almoment'
import useForm from '../hooks/useForm'
import { toast } from 'react-toastify'
import useFetch from '../hooks/useFetch'
import Comment from './Comment'
const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      width: '40vw',
    },
  },
})
const destinations = [
  { label: 'Namangan', year: 1994 },
  { label: 'Jizzakh', year: 1972 },
]
const containerTypes = [
  { label: '45', year: 1994 },
  { label: '23', year: 1972 },
]
export default function CommentsDrawer({ open, setOpen, onEdit,currentDate }) {
  const cls = useStyles()
  const isUpdate = open && typeof open === 'string'
  const { data: trains } = useFetch(() => requests.train.getAll())
  const { data, refetch, isLoading, reset: resetData } = useFetch((...args) =>
    requests.comment.getComments(...args)
  )
  const { register, handleSubmit, reset, setValue } = useForm({
    onSubmit,
    onError,
  })
  function onSubmit(data) {
    console.log('SUBMIT', data)
    const requestBody = {
      issue_date: format(data?.issue_date, 'YYYY-MM-DD'),
    }
    refetch(data?.train?.train_id, requestBody)
  }
  function onError(data) {
    toast.error('Please, fill in all fields')
  }

  useEffect(() => {
    if (!open) {
      reset()
      resetData()
    }
    else {
      setValue("issue_date", currentDate)
    }
   
  }, [open])
  console.log('data', data)
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
            All comments
          </Typography>
          <Box display='flex' flexDirection='column'>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                mb: 1,
              }}
            >
              Filter
            </Typography>
            <Box display='flex' justifyContent='space-between'>
              <Select
                label='Train'
                options={
                  trains?.data?.trains?.map((el) => ({
                    ...el,
                    label: el.name,
                  })) || []
                }
                sx={{
                  flexBasis: '50%',
                  marginRight: 1,
                }}
                {...register('train', {
                  required: true,
                })}
              />
              <DatePicker
                sx={{
                  flexBasis: '50%',
                  marginRight: 1,
                }}
                label='Issue date'
                {...register('issue_date')}
              />
            </Box>
          </Box>
          <Box mt={2}>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              isLoading={isLoading}
            >
              Apply
            </Button>
          </Box>
          <hr style={{ margin: '24px 0' }} />
          {data?.data?.comments?.length ? data?.data?.comments?.map((el, key) => (
            <Comment onEdit={(e) =>{
              onEdit(e)
              setOpen(false)
            }} key={key} data={el} trains={trains?.data?.trains} />
          )): "No comment"}
        </Box>
      </form>
    </Drawer>
  )
}

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
import AddCommentForm from './AddCommentForm'
import CommentList from './CommentList'
import useDeepCompareEffect from '../hooks/useDeepCompareEffect'
const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      width: '40vw',
    },
  },
})

export default function AddEventDrawer({ open, setOpen, afterSubmit, type }) {
  const cls = useStyles()
  const isUpdate = open && typeof open === 'string'
  const { data: comments, refetch: refetchComments } = useFetch(
    (id, filter) => id && requests.comment.getComments(id, filter),
    { enabled: isUpdate }
  )
  const { data: trains } = useFetch(() => requests.train.getAll())
  const { data: trainSingle, refetch } = useFetch(
    () => requests.train.getSingle(open),
    {
      enabled: isUpdate,
    }
  )
  const { data: destinations } = useFetch(() =>
    requests.train.getDestinations({
      size: 100,
    })
  )
  const { mutate, isLoading } = useRequest(requests.train.create, {
    onSuccess() {
      toast.success('Created successfully!')
      setOpen(false)
      afterSubmit()
    },
  })
  const { mutate: update, isLoading: isUpdating } = useRequest(
    requests.train.update,
    {
      onSuccess(res) {
        toast.success('Updated successfully!')
        setOpen(false)
        afterSubmit()
      },
    }
  )
  const { register, handleSubmit, reset, setValues } = useForm({
    onSubmit,
    onError,
  })
  function onSubmit(data) {
    const requestBody = {
      ...data,
      from_destination: data?.from_destination.label,
      to_destination: data?.to_destination.label,
      import_departure_date: format(data.import_departure_date, 'YYYY-MM-DD'),
      import_arrival_date: format(data.import_arrival_date, 'YYYY-MM-DD'),
      export_departure_date: format(data.export_departure_date, 'YYYY-MM-DD'),
      export_arrival_date: format(data.export_arrival_date, 'YYYY-MM-DD'),
      number_of_containers: `${data?.number_of_containers}`,
      number_of_wagons: `${data?.number_of_wagons}`,
    }
    console.log('requestBody', requestBody)
    if (isUpdate) {
      update(open, requestBody)
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
    }
    if (open && ![true, false].includes(open)) {
      setValues({
        import_departure_date: open,
        export_departure_date: open,
      })
    }
    if (isUpdate) {
      refetch()
    }
  }, [open])
  useEffect(() => {
    if (trainSingle?.data?.train_id) {
      refetchComments(trainSingle?.data?.train_id)
    }
  }, [trainSingle])
  useDeepCompareEffect(() => {
    if (trainSingle?.data) {
      const destFrom = destinations?.data?.destinations?.find(
        (el) => el.name === trainSingle?.data.from_destination
      )
      const destTo = destinations?.data?.destinations?.find(
        (el) => el.name === trainSingle?.data.to_destination
      )
      const formatted = {
        id: trainSingle?.train_id,
        name: trainSingle?.data?.name,
        from_destination: destFrom && { ...destFrom, label: destFrom?.name },
        to_destination: destTo && { ...destTo, label: destTo?.name },
        import_departure_date: format(
          trainSingle?.data?.import_departure_date,
          'YYYY-MM-DD'
        ),
        import_arrival_date: format(
          trainSingle?.data?.import_arrival_date,
          'YYYY-MM-DD'
        ),
        export_departure_date: format(
          trainSingle?.data?.export_departure_date,
          'YYYY-MM-DD'
        ),
        export_arrival_date: format(
          trainSingle?.data?.export_arrival_date,
          'YYYY-MM-DD'
        ),
        export_color: trainSingle?.data?.export_color,
        import_color: trainSingle?.data?.import_color,
        number_of_containers: trainSingle?.data?.number_of_containers,
        number_of_wagons: trainSingle?.data?.number_of_wagons,
      }
      setValues(formatted)
    }
  }, [trainSingle, destinations])
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
            {isUpdate ? 'Update' : 'Add'} train {type ? `(${type})` : ''}
          </Typography>
          <Box display='flex' flexDirection='column'>
            <Input
              label='Name'
              {...register('name', {
                defaultValue: '',
                required: true,
              })}
            />
            <Box mt={2} display='flex'>
              <DatePicker
                label='Import departure date'
                {...register('import_departure_date', {
                  required: true,
                })}
              />
              <DatePicker
                label='Import arrival date'
                sx={{ marginLeft: 1 }}
                {...register('import_arrival_date', {
                  required: true,
                })}
              />
            </Box>
            <Box mt={2} display='flex'>
              <DatePicker
                label='Export departure date'
                {...register('export_departure_date', {
                  required: true,
                })}
              />
              <DatePicker
                label='Export arrival date'
                sx={{ marginLeft: 1 }}
                {...register('export_arrival_date', {
                  required: true,
                })}
              />
            </Box>
            <Select
              label='Destination from'
              options={destinations?.data?.destinations?.map((el) => ({
                ...el,
                label: el.name,
              }))}
              {...register('from_destination', {
                required: true,
              })}
            />
            <Select
              label='Destination to'
              options={destinations?.data?.destinations?.map((el) => ({
                ...el,
                label: el.name,
              }))}
              {...register('to_destination', {
                required: true,
              })}
            />
            <Box mt={1} display='flex'>
              <Input
                label='Numbers of container'
                sx={{ mr: 1 }}
                type='number'
                fullWidth
                {...register('number_of_containers', {
                  required: true,
                  isInteger: true,
                })}
              />
              <Input
                label='Numbers of wagons'
                type='number'
                fullWidth
                {...register('number_of_wagons', {
                  required: true,
                  isInteger: true,
                })}
              />
            </Box>
          </Box>
          <ColorPicker
            label={'Import color'}
            {...register('import_color', {
              required: false,
            })}
          />
          <ColorPicker
            label={'Export color'}
            {...register('export_color', {
              required: false,
            })}
          />
          <Box mt={2}>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              isLoading={isLoading || isUpdating}
            >
              {isUpdate ? 'Update' : 'Add'} train
            </Button>
          </Box>
        </Box>
      </form>
      {isUpdate && open ? (
        <>
          <AddCommentForm
            trainId={trainSingle?.data?.train_id}
            afterSubmit={() => refetchComments(trainSingle?.data?.train_id)}
          />
          <Box px={4} mb={4}>
            <hr style={{ margin: '24px 0' }} />
            <CommentList
              comments={comments}
              trains={trains}
              afterSubmit={() => {
                afterSubmit()
                refetchComments(trainSingle?.data?.train_id)
              }}
            />
          </Box>
        </>
      ) : (
        ''
      )}
    </Drawer>
  )
}

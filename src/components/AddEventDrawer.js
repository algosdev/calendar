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
export default function AddEventDrawer({ open, setOpen }) {
  const cls = useStyles()
  const isUpdate = open && typeof open === 'string'
  const { mutate, isLoading } = useRequest(requests.train.create, {
    onSuccess(res) {
      console.log('RES', res)
      toast.success('Created successfully!')
      setOpen(false)
    },
  })
  const { mutate: update, isLoading: isUpdating } = useRequest(
    requests.train.update,
    {
      onSuccess(res) {
        console.log('RES', res)
        toast.success('Created successfully!')
        setOpen(false)
      },
    }
  )
  const { data, refetch } = useFetch(() => requests.train.getSingle(open), {
    enabled: isUpdate,
  })
  const { register, handleSubmit, reset, setValues } = useForm({
    onSubmit,
    onError,
  })
  function onSubmit(data) {
    console.log('onSubmit', data)
    const requestBody = {
      ...data,
      container_type: data.container_type.label,
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
    console.log('onSubmitError', data)
    toast.error('Please, fill in all fields')
  }

  useEffect(() => {
    if (!open) {
      reset()
    }
    if (isUpdate) {
      refetch()
    }
  }, [open])
  useEffect(() => {
    if (data?.data) {
      const formatted = {
        id: data?.train_id,
        name: data?.data?.name,
        container_type: containerTypes?.find(
          (el) => el.label === data?.data.container_type
        ),
        from_destination: containerTypes?.find(
          (el) => el.label === data?.data.from_destination
        ),
        to_destination: containerTypes?.find(
          (el) => el.label === data?.data.to_destination
        ),
        import_departure_date: format(
          data?.data?.import_departure_date,
          'YYYY-MM-DD'
        ),
        import_arrival_date: format(
          data?.data?.import_arrival_date,
          'YYYY-MM-DD'
        ),
        export_departure_date: format(
          data?.data?.export_departure_date,
          'YYYY-MM-DD'
        ),
        export_arrival_date: format(
          data?.data?.export_arrival_date,
          'YYYY-MM-DD'
        ),
        number_of_containers: data?.data?.number_of_containers,
        number_of_wagons: data?.data?.number_of_wagons,
      }
      setValues(formatted)
    }
    console.log('data', data)
  }, [data])
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
            {isUpdate ? 'Update' : 'Add'} event
          </Typography>
          <Box display='flex' flexDirection='column'>
            <Input
              label='Name'
              {...register('name', {
                defaultValue: '',
                required: true,
              })}
            />
            <Select
              label='Container type'
              options={containerTypes}
              {...register('container_type', {
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
              options={destinations}
              {...register('from_destination', {
                required: true,
              })}
            />
            <Select
              label='Destination to'
              options={destinations}
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
          {/* <ColorPicker
          onChange={(val) => {
            setValues({ ...values, backgroundColor: val })
          }}
          value={values.backgroundColor}
        /> */}
          <Box mt={2}>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              isLoading={isLoading || isUpdating}
              // onClick={() => mutate(values)}
            >
              {isUpdate ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  )
}

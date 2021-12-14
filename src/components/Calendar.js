import React, { useRef, useState } from 'react'
import './styles.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import AddEventDrawer from './AddEventDrawer'
import useFetch from '../hooks/useFetch'
import requests from '../requests'
import useDeepCompareEffect from '../hooks/useDeepCompareEffect'
import { format } from 'almoment'
import { Typography } from '@mui/material'
import Button from './common/Button'
import Popper from './common/Popper'
import AddCommentDrawer from './AddCommentDrawer'
import CommentsDrawer from './CommentsDrawer'
import CommentIcon from '../icons/CommentIcon'
import { toast } from 'react-toastify'
import useRequest from '../hooks/useRequest'
import moment from 'moment'
export default function Calendar() {
  const { data, refetch } = useFetch(() =>
    requests.train.getAll({
      size: 10,
      page: 1,
    })
  )
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openCommentDrawer, setOpenCommentDrawer] = useState(false)
  const [openComents, setOpenComments] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [type, setType] = useState(null)
  const [events, setEvents] = useState([])
  const currentDate = useRef()
  const handleSubmit = () => {
    refetch()
  }
  const { mutate: update } = useRequest(requests.train.update, {
    onSuccess(res) {
      toast.success('Updated successfully!')
      refetch()
    },
  })
  function renderEventContent(eventInfo) {
    return (
      <>
        <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>{eventInfo.event.title}</b>
          <i>
            {eventInfo.event.extendedProps.comment_count}
            <CommentIcon style={{ marginLeft: 4 }} />
          </i>
        </Typography>
      </>
    )
  }
  const handleClick = (eventInfo) => {
    setOpenDrawer(eventInfo.id)
    setType(eventInfo?.extendedProps?.type)
  }
  const handleChange = (eventInfo) => {
    requests.train.getSingle(eventInfo.id)?.then((res) => {
      const {
        start,
        end,
        extendedProps: { type },
      } = eventInfo
      const requestBody = {
        ...res.data,
        ...(type === 'import' && {
          import_arrival_date: format(end, 'YYYY-MM-DD'),
          import_departure_date: format(start, 'YYYY-MM-DD'),
        }),
        ...(type === 'export' && {
          export_arrival_date: format(end, 'YYYY-MM-DD'),
          export_departure_date: format(start, 'YYYY-MM-DD'),
        }),
      }
      console.log('requestBody', requestBody)
      update(eventInfo.id, requestBody)
    })
  }
  useDeepCompareEffect(() => {
    if (data) {
      const formatted = data.data?.trains?.reduce((init, el) => {
        const formattedImport = {
          id: el.train_id,
          type: 'import',
          title: el.name,
          // end: format(el.import_arrival_date, 'YYYY-MM-DD'),
          end: moment(el.import_arrival_date, 'YYYY-MM-DD')
            .add(1, 'days')
            .format('YYYY-MM-DD'),
          start: format(el.import_departure_date, 'YYYY-MM-DD'),
          comment_count: el?.comment_count,
          backgroundColor: el?.import_color || '#ef476f',
        }
        const formattedExport = {
          id: el.train_id,
          type: 'export',
          title: el.name,
          // end: format(el.export_arrival_date, 'YYYY-MM-DD'),
          end: moment(el.export_arrival_date, 'YYYY-MM-DD')
            .add(1, 'days')
            .format('YYYY-MM-DD'),
          start: format(el.export_departure_date, 'YYYY-MM-DD'),
          comment_count: el?.comment_count,
          backgroundColor: el?.export_color || '#118ab2',
        }
        init.push(formattedImport)
        init.push(formattedExport)
        return init
      }, [])
      setEvents(formatted || [])
    }
  }, [data])
  console.log('EVENTS', events)
  return (
    <>
      <div>
        <div
          style={{
            float: 'left',
            width: 'calc(100vw - 16px)',
            overflow: 'hidden',
            padding: 32,
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next new',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            eventContent={renderEventContent}
            customButtons={{
              new: {
                text: 'New train',
                click: () => setOpenDrawer(true),
              },
              new_comment: {
                text: 'New comment',
                click: () => setOpenCommentDrawer(true),
              },
              see_all_comments: {
                text: 'All comments',
                click: () => setOpenComments(true),
              },
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends
            events={events}
            // eventStartEditable
            // eventResizableFromStart
            eventDurationEditable
            // droppable={true}
            // eventRender={(event, element) => {
            //   element.bind('dblclick', function () {
            //     alert('double click!')
            //   })
            // }}
            dateClick={(e) => {
              // setAnchorEl(e.dayEl)
              setOpenDrawer(e.date)
              currentDate.current = e.date
              // setOpenCommentDrawer(true)
            }}
            eventChange={(e) => handleChange(e.event)}
            eventClick={(e) => {
              handleClick(e.event)
            }}
          />
        </div>
      </div>
      <AddEventDrawer
        setOpen={setOpenDrawer}
        open={openDrawer}
        afterSubmit={handleSubmit}
        type={type}
      />
      <AddCommentDrawer
        setOpen={setOpenCommentDrawer}
        open={openCommentDrawer}
        afterSubmit={handleSubmit}
        currentDate={currentDate.current}
      />
      <CommentsDrawer
        setOpen={setOpenComments}
        open={openComents}
        afterSubmit={handleSubmit}
        onEdit={(id) => setOpenCommentDrawer(id)}
        currentDate={currentDate.current}
      />
      <Popper anchorEl={anchorEl}>
        <Button
          variant='contained'
          onClick={(e) => {
            e.stopPropagation()
            setAnchorEl(null)
            setOpenCommentDrawer(true)
          }}
          sx={{ cursor: 'pointer' }}
        >
          Add Comment
        </Button>
        <Button
          variant='contained'
          onClick={(e) => {
            e.stopPropagation()
            setAnchorEl(null)
            setOpenComments(true)
          }}
          sx={{ cursor: 'pointer', ml: 1 }}
        >
          See comments
        </Button>
      </Popper>
    </>
  )
}

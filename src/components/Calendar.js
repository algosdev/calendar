import React, { useRef, useState } from 'react'
import './styles.css'
import FullCalendar, { Tooltip } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import AddEventDrawer from './AddEventDrawer'
import useFetch from '../hooks/useFetch'
import requests from '../requests'
import useDeepCompareEffect from '../hooks/useDeepCompareEffect'
import { format } from 'almoment'
import { Toolbar } from '@mui/material'
import Button from './common/Button'
import Popper from './common/Popper'
import AddCommentDrawer from './AddCommentDrawer'
import CommentsDrawer from './CommentsDrawer'
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
  const [events, setEvents] = useState([])
  const currentDate = useRef()
  const handleSubmit = () => {
    refetch()
  }
  //   const hybridClick = useDoubleClick(
  //     () => setDoubleClickCount(doubleClickCount + 1),
  //     () => setClickCount(clickCount + 1),
  // );
  function renderEventContent(eventInfo) {
    return (
      <>
        {/* <Toolbar title={
          <Button>H</Button>
        }
        style={{
          minHeight: 16
        }}> */}
        {/* <Popper> */}
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        {/* </Popper> */}
        {/* </Toolbar> */}
      </>
    )
  }
  const handleClick = (eventInfo) => {
    setOpenDrawer(eventInfo.id)
  }
  useDeepCompareEffect(() => {
    if (data) {
      const formatted = data.data?.trains?.reduce((init, el) => {
        const formattedImport = {
          id: el.train_id,
          type: 'import',
          title: el.name,
          end: format(el.import_arrival_date, 'YYYY-MM-DD'),
          start: format(el.import_departure_date, 'YYYY-MM-DD'),
          backgroundColor: '#ef476f',
        }
        const formattedExport = {
          id: el.train_id,
          type: 'import',
          title: el.name,
          end: format(el.import_arrival_date, 'YYYY-MM-DD'),
          start: format(el.import_departure_date, 'YYYY-MM-DD'),
          backgroundColor: '#118ab2',
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
            // editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends
            events={events}
            // eventStartEditable
            // eventResizableFromStart
            // eventDurationEditable
            droppable={true}
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
            // eventChange={(e) => handleChange(e.event)}
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
      />
      <AddCommentDrawer
        setOpen={setOpenCommentDrawer}
        open={openCommentDrawer}
        afterSubmit={handleSubmit}
        currentDate={currentDate.current}
      />
      <CommentsDrawer setOpen={setOpenComments}
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
          sx={{ cursor: 'pointer', ml:1 }}
        >
          See comments
        </Button>
      </Popper>
    </>
  )
}

import React, { useState } from 'react'
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
export default function Calendar() {
  const { data } = useFetch(() =>
    requests.train.getAll({
      size: 10,
      page: 1,
    })
  )
  const [openDrawer, setOpenDrawer] = useState(false)
  const [events, setEvents] = useState([])
  const handleSubmit = (data) => {
    setOpenDrawer(false)
    const isUpdating = events.find((el) => el.id === data.id)
    if (isUpdating) {
      setEvents((state) => {
        const updatedEvents = state.map((el) => (el.id === data.id ? data : el))
        return updatedEvents
      })
      return
    }
    setEvents((state) => {
      return state.concat({
        id: `${new Date().getTime()}`,
        ...data,
      })
    })
  }
  const handleChange = (eventInfo) => {
    const formatted = {
      id: eventInfo.id,
      title: eventInfo.title,
      end: eventInfo.end,
      start: eventInfo.start,
      backgroundColor: eventInfo.backgroundColor,
    }
    setEvents((state) => {
      const updatedEvents = state.map((el) =>
        el.id === formatted.id ? formatted : el
      )
      return updatedEvents
    })
  }
  function renderEventContent(eventInfo) {
    return (
      <>
        {/* <Toolbar title='Add'> */}
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        {/* </Toolbar> */}
      </>
    )
  }
  const handleClick = (eventInfo) => {
    const formatted = {
      id: eventInfo.id,
      title: eventInfo.title,
      end: eventInfo.end,
      start: eventInfo.start,
      backgroundColor: eventInfo.backgroundColor,
    }
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
          backgroundColor: 'red',
        }
        const formattedExport = {
          id: el.train_id,
          type: 'import',
          title: el.name,
          end: format(el.import_arrival_date, 'YYYY-MM-DD'),
          start: format(el.import_departure_date, 'YYYY-MM-DD'),
          backgroundColor: 'green',
        }
        init.push(formattedImport)
        init.push(formattedExport)
        // const arr = [formattedImport, formattedExport]
        // init.concat(arr)
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
              left: 'prev,next today new submit',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            eventContent={renderEventContent}
            customButtons={{
              new: {
                text: 'New event',
                click: () => setOpenDrawer(true),
              },
              submit: {
                text: 'Submit',
                click: () => alert(JSON.stringify(events, null, 1)),
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
            eventChange={(e) => handleChange(e.event)}
            eventClick={(e) => handleClick(e.event)}
          />
        </div>
      </div>
      {/* {openDrawer && ( */}
      <AddEventDrawer
        setOpen={setOpenDrawer}
        open={openDrawer}
        onSubmit={handleSubmit}
      />

      {/* )} */}
    </>
  )
}

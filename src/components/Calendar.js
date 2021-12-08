import React, { useState } from 'react'
import './styles.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import AddEventDrawer from './AddEventDrawer'

export default function Calendar() {
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
        const updatedEvents = state.map((el) => (el.id === formatted.id ? formatted : el))
        return updatedEvents
      })
  }
  const handleClick = (eventInfo) => {
    const formatted = {
      id: eventInfo.id,
      title: eventInfo.title,
      end: eventInfo.end,
      start: eventInfo.start,
      backgroundColor: eventInfo.backgroundColor,
    }
    setOpenDrawer(formatted)
  }
  console.log("EVENTS", events)
  return (
    <>
      <div className='App'>
        <div
          style={{
            float: 'left',
            width: 'calc(100vw - 64px)',
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
            customButtons={{
              new: {
                text: 'New event',
                click: () => setOpenDrawer(true),
              },
              submit: {
                text: "Submit",
                click: () => alert(JSON.stringify(events, null,1)),
              },
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends
            events={events}
            eventStartEditable
            eventResizableFromStart
            eventDurationEditable
            droppable={true}
            eventChange={(e) => handleChange(e.event)}
            eventClick={(e) =>  handleClick(e.event)}
            eventAdd={(e) => console.log("ADD",e)}
            eventReceive={(e) => console.log("ADD",e)}
            eventDrop={(e) => console.log("ADD",e)}
          />
        </div>
      </div>
      <AddEventDrawer
        setOpen={setOpenDrawer}
        open={openDrawer}
        onSubmit={handleSubmit}
      />
    </>
  )
}

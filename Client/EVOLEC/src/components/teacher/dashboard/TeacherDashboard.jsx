import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../../services/authService";
import { getRequest } from "../../../services/APIService";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const TeacherDashboard = () => {
  const [events, setEvents] = useState();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    let uid = getUserIdFromToken(localStorage.getItem("token"));
    try {
      var result = await getRequest(`/user/teaching-lesson-dates/${uid}`);
      if (result.status && result.status == true) {
        setEvents(result.data);
        console.log(result.data);
        console.log("FetchEvents: Fetch events successfully")
      }
      console.log(events);
      console.log(uid);
    } catch (ex) {
      console.log("FetchEvents: Cannot fetch events")
    }
  }
  useEffect(() => {
    fetchEvents();
  }, [])
  const handleEventClick = (info) => {
    console.log(info)
    navigate(`/teacher/lesson-date/${info.event.id}`)
  };
  const eventContentTemplate = (info) => {
    return (
      <div className="text-lg w-full text-center align-middle bg-[#3795e6] text-white font-semibold py-1 rounded-xl cursor-pointer">{info.event.extendedProps.lessonName}</div>
    )
  }
  return (
    <div className="p-4">
      <h2 className="text-4xl font-semibold mb-4 text-center">Teacher's Schedule</h2>

      <FullCalendar
        height={"75vh"}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        allDaySlot={false}
        slotMinTime="07:00:00"
        slotMaxTime="17:00:00"
        slotDuration="00:30:00"
        events={events}
        eventClick={handleEventClick}
        eventBackgroundColor={"#228be6"}
        eventContent={eventContentTemplate}
      />
    </div>
  )
}

export default TeacherDashboard;
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "../../../services/authService";
import { getRequest } from "../../../services/APIService";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [events, setEvents] = useState();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    let uid = getUserIdFromToken(localStorage.getItem("token"));
    try {
      var result = await getRequest(`/user/studying-lesson-dates/${uid}`);
      if (result.status && result.status == true) {
        setEvents(result.data);
        console.log("FetchEvents: Fetch events successfully")
      }
    } catch (ex) {
      console.log("FetchEvents: Cannot fetch events")
    }
  }
  useEffect(() => {
    fetchEvents();
  }, [])
  const handleEventClick = (info) => {
    //alert(`Bạn đã nhấn vào sự kiện: ${info.event.title}\nThời gian: ${info.event.start.toLocaleString()}`);
    navigate(`/student/lesson-date/${info.event.id}`)
  };
  const eventContentTemplate = (info) => {
    return (
      <div className="text-lg w-full text-center align-middle bg-[#3795e6] text-white font-semibold py-1 rounded-xl cursor-pointer">{info.event.extendedProps.lessonName}</div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-semibold mb-4 text-center mb-5">Student's Time Table</h2>

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
  );
}

export default StudentDashboard;
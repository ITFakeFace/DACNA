import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../../services/APIService";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState();
  const [events, setEvents] = useState();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      let result = await getRequest(`/room/get-schedule/${id}`);
      if (result.status && result.status == true) {
        setEvents(result.data);
        console.log("FetchEvents: Fetch events successfully");
      }
    } catch (ex) {
      console.log("FetchEvents: Failed to fetch events");
    }
  }

  const fetchRoom = async () => {
    try {
      let result = await getRequest(`/room/${id}`);
      if (result.status && result.status == true) {
        setRoom(result.data);
        console.log("FetchRoom: Fetch room successfully");
      }
    } catch (ex) {
      console.log("FetchRoom: Failed to fetch room ");
    }
  }

  useEffect(() => {
    fetchEvents();
    fetchRoom();
  }, []);
  const handleEventClick = (info) => {
    //alert(`Bạn đã nhấn vào sự kiện: ${info.event.title}\nThời gian: ${info.event.start.toLocaleString()}`);
    console.log("Clicked Event: " + info.event.extendedProps.lessonId);
    navigate(`/admin/lesson-dates/${info.event.extendedProps.lessonId}`)
  };
  const eventContentTemplate = (info) => {
    return (
      <div className="text-lg w-full text-center align-middle bg-[#3795e6] text-white font-semibold py-1 rounded-xl cursor-pointer">{info.event.extendedProps.lessonName}</div>
    )
  }
  return (
    <div className="p-4 flex flex-col items-center w-full">
      <h2 className="text-4xl font-semibold mb-5 text-center">Room Information</h2>
      <div className="w-full">
        <div className="w-4/5">
          <div>Room Code:</div>
          <div></div>
        </div>
      </div>


      <div className="w-full">
        <h2 className="text-4xl font-semibold mb-5 text-center">Room Occupation Schedule</h2>
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
    </div>
  );
}

export default RoomDetailsPage;
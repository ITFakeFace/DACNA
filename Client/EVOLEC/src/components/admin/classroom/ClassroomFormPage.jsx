import React, { useState, useEffect } from 'react';
import {
  Button, TextInput, Group, Box, Notification
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCheck, IconX } from '@tabler/icons-react';
import { postRequest, getRequest, putRequest } from '../../../services/APIService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from 'primereact/dropdown';
import { getUserIdFromToken, getUsernameFromToken } from '../../../services/authService';
import './ClassroomFromPage.css';

const ClassroomFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [form, setForm] = useState({
    id: '',
    teacher1Id: '',
    teacher2Id: '',
    courseId: '',
    startDate: null,
    endDate: null,
    status: 'Active',
    shift: '',
    RoomId: '',
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await getRequest("/user/teachers?enable=true");
        if (res.status) {
          setTeachers(res.data);
        } else {
          setFeedback({ type: 'warn', message: 'No teachers found' });
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setFeedback({ type: 'error', message: 'Failed to load teachers' });
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await getRequest("/course");
        if (res.status) {
          setCourses(res.data);
        } else {
          setFeedback({ type: 'warn', message: 'No courses found' });
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setFeedback({ type: 'error', message: 'Failed to load courses' });
      }
    };

    const fetchShifts = async () => {
      try {
        const res = await getRequest("/Shift/getAllShifts");
        if (res.status) {
          const formattedShifts = res.data.map(shift => {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const days = shift.dayOfWeeks.map(day => dayNames[day - 1]);
            return {
              value: shift.id,
              label: `From: ${shift.fromTime} To: ${shift.toTime} - Days: ${days.join(', ')}`,
            };
          });
          setShifts(formattedShifts);
        } else {
          setFeedback({ type: 'warn', message: 'No shifts found' });
        }
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setFeedback({ type: 'error', message: 'Failed to load shifts' });
      }
    };
    const fetchRooms = async () => {
      try {
        const res = await getRequest("/room"); // Đường dẫn giả định, sửa lại nếu khác
        if (res.status) {
          setRooms(res.data);
        } else {
          setFeedback({ type: 'warn', message: 'No rooms found' });
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setFeedback({ type: 'error', message: 'Failed to load rooms' });
      }
    };

    fetchTeachers();
    console.log(1)
    fetchCourses();
    console.log(2)
    fetchShifts();
    console.log(3)
    fetchRooms();
    if (id) {
      const fetchClassroom = async () => {
        try {
          const res = await getRequest(`/classroom/${id}`);
          console.log(res)
          if (res && res.status && res.data) {
            const classroom = res.data;
            setForm(prev => ({
              ...prev,
              id: id,
              teacher1Id: classroom.teacher1.id,
              teacher2Id: classroom.teacher2.id,
              courseId: classroom.course.id,
              startDate: classroom.startDate ? new Date(classroom.startDate) : null,
              status: 'Active',
              shift: classroom.shift,
            }));
            console.log(form)
          } else {
            setFeedback({ type: 'error', message: 'Cannot load classroom data' });
          }
        } catch (error) {
          console.error('Error fetching classroom:', error);
          setFeedback({ type: 'error', message: 'Error fetching classroom data' });
        }
      };
      fetchClassroom();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      teacher1Id: form.teacher1Id,
      teacher2Id: form.teacher2Id,
      courseId: form.courseId,
      creatorId: getUserIdFromToken(localStorage.getItem('token')),
      startDate: form.startDate ? form.startDate.toISOString().split('T')[0] : null,
      status: 1,
      shift: form.shift,
      RoomId: form.RoomId,
    };
    console.log(payload)
    try {
      let result;
      if (id) {
        result = await putRequest(`/classrooms/${id}`, payload);
      } else {
        result = await postRequest('/classroom/create', payload);
      }
      if (result.status) {
        if (result.ResponseCode === 200) {
          setFeedback({ type: 'success', message: result.statusMessage });
        }
        else{
          setFeedback({ type: 'warn', message: result.statusMessage });
        }
        setTimeout(() => {
          navigate("/admin/classrooms");
          window.location.reload();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.statusMessage || (id ? 'Failed to Update Classroom' : 'Failed to Create Classroom') });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFeedback({ type: 'error', message: 'Server error during submit' });
    }
  };

  return (
    <div className='container'>
      <div className='mb-4'>
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => navigate("/admin/classrooms")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className='font-bold text-2xl'>
          {id ? 'Update Classroom' : 'Create New Classroom'}
        </span>
      </div>

      <Box maw={600} mx="auto">
        {feedback && (
            <Notification
              icon={
                feedback.type === 'success' ? (
                  <IconCheck size={18} />
                ) : feedback.type === 'warning' ? ( // Added warning condition
                  <IconAlertTriangle size={18} /> // You'll need to import IconAlertTriangle
                ) : (
                  <IconX size={18} />
                )
              }
              color={feedback.type === 'success' ? 'teal' : feedback.type === 'warning' ? 'yellow' : 'red'} // Added warning color
              title={feedback.type === 'success' ? 'Success' : feedback.type === 'warning' ? 'Warning' : 'Failed'} // Added warning title
              onClose={() => setFeedback(null)}
              mb="md"
            >
              {feedback.message}
            </Notification>
        )}

        {/* <form onSubmit={handleSubmit} className='flex flex-col gap-5'> */}
        <form onSubmit={handleSubmit} className='classroom-form'>

          <div className="p-field">
            <label htmlFor="teacher1Id">Teacher 1</label>
            <Dropdown
              id="teacher1Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.teacher1Id}
              onChange={(e) => setForm(prev => ({ ...prev, teacher1Id: e.value }))}
              placeholder="Select Teacher 1"
              filter
              showClear
            />
          </div>

          <div className="p-field">
            <label htmlFor="teacher2Id">Teacher 2</label>
            <Dropdown
              id="teacher2Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.teacher2Id}
              onChange={(e) => setForm(prev => ({ ...prev, teacher2Id: e.value }))}
              placeholder="Select Teacher 2"
              filter
              showClear
            />
          </div>

          <div className="p-field">
            <label htmlFor="courseId">Course</label>
            <Dropdown
              id="courseId"
              options={courses}
              optionLabel="name"
              optionValue="id"
              value={form.courseId}
              onChange={(e) => setForm(prev => ({ ...prev, courseId: e.value }))}
              placeholder="Select Course"
              filter
              showClear
            />
          </div>

          <div className="p-field">
            <label htmlFor="roomId">Room</label>
            <Dropdown
              id="roomId"
              options={rooms}
              optionLabel="name"
              optionValue="id"
              value={form.RoomId}
              onChange={(e) => setForm(prev => ({ ...prev, RoomId: e.value }))}
              placeholder="Select Room"
              filter
              showClear
              required
            />
          </div>

          <TextInput
            label="Creator"
            value={getUsernameFromToken(localStorage.getItem('token')) || ''}
            disabled
            className="custom-disabled-input select-none"
          />

          <div className="mb-3">
            <label>Start Date</label>
            <br />
            <DatePicker
              selected={form.startDate}
              onChange={(date) => setForm(prev => ({ ...prev, startDate: date, endDate: null }))}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
              className="form-control"
            />
          </div>

          <div className="p-field">
            <label htmlFor="shift">Shift</label>
            <Dropdown
              label="Shift"
              placeholder="Select Shift"
              options={shifts}
              optionLabel="label"
              optionValue="value"
              value={form.shift}
              onChange={(e) => setForm(prev => ({ ...prev, shift: e.value }))}
              filter
              showClear
              required
              mt="sm"
            />
          </div>

          <Group position="right" mt="md">
            <Button type="submit">{id ? 'Update Classroom' : 'Create New Classroom'}</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default ClassroomFormPage;
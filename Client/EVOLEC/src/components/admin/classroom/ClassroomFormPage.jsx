import React, { useState, useEffect } from 'react';
import {
  Button, TextInput, Group, Box, Notification, Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
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
  const { id } = useParams(); // id có nghĩa là update, không có là create
  const [feedback, setFeedback] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  const form = useForm({
    initialValues: {
      id: '',
      teacher1Id: '',
      teacher2Id: '',
      courseId: '',
      startDate: null,
      endDate: null,
      status: 'Active',
      shift: '',
    },
    validate: {
      teacher1Id: (value) => (value ? null : 'Teacher 1 is required'),
      teacher2Id: (value) => (value ? null : 'Teacher 2 is required'),
      courseId: (value) => (value ? null : 'Course is required'),
      status: (value) => (value ? null : 'Status is required'),
      shift: (value) => (value ? null : 'Shift is required'),
    },
  });

  useEffect(() => {
    // Load classroom data nếu có id
    if (id) {
      const fetchClassroom = async () => {
        try {
          const res = await getRequest(`/classrooms/${id}`);
          if (res && res.status && res.data) {
            const classroom = res.data;
            form.setValues({
              id: classroom.id,
              teacher1Id: classroom.teacher1Id,
              teacher2Id: classroom.teacher2Id,
              courseId: classroom.courseId,
              startDate: classroom.startDate ? new Date(classroom.startDate) : null,
              endDate: classroom.endDate ? new Date(classroom.endDate) : null,
              status: classroom.status,
              shift: classroom.shift,
            });
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

    // Load danh sách teachers
    const fetchTeachers = async () => {
      try {
        const res = await getRequest("/user/teachers");
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

    // Load danh sách courses
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

    fetchTeachers();
    fetchCourses();
  }, [id]);

  const handleSubmit = async (values) => {
    // Chuẩn bị payload với creatorId lấy từ token
    const payload = {
      teacher1Id: values.teacher1Id,
      teacher2Id: values.teacher2Id,
      courseId: values.courseId,
      creatorId: getUserIdFromToken(localStorage.getItem('token')),
      startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : null,
      endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
      status: values.status,
      shift: values.shift,
    };

    try {
      let result;
      if (id) {
        result = await putRequest(`/classrooms/${id}`, payload);
      } else {
        result = await postRequest('/classrooms', payload);
      }

      if (result.status) {
        setFeedback({ type: 'success', message: result.statusMessage });
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
          onClick={() => window.location.replace("/admin/classrooms")}
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
            icon={feedback.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Success' : 'Failed'}
            onClose={() => setFeedback(null)}
            mb="md"
          >
            {feedback.message}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <div className="p-field">
            <label htmlFor="teacher1Id">Teacher 1</label>
            <Dropdown
              id="teacher1Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.values.teacher1Id}
              onChange={(e) => form.setFieldValue('teacher1Id', e.value)}
              placeholder="Select Teacher 1"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>

          <div className="p-field">
            <label htmlFor="teacher2Id">Teacher 2</label>
            <Dropdown
              id="teacher2Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.values.teacher2Id}
              onChange={(e) => form.setFieldValue('teacher2Id', e.value)}
              placeholder="Select Teacher 2"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>

          <div className="p-field">
            <label htmlFor="courseId">Course</label>
            <Dropdown
              id="courseId"
              options={courses}
              optionLabel="name"
              optionValue="id"
              value={form.values.courseId}
              onChange={(e) => form.setFieldValue('courseId', e.value)}
              placeholder="Select Course"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>

          <TextInput
            label="Creator"
            value={getUsernameFromToken(localStorage.getItem('token')) || ''}
            disabled
            hidden
            className="custom-disabled-input"
          />

          <div className="mb-3">
            <label>Start Date</label>
            <br />
            <DatePicker
              selected={form.values.startDate}
              onChange={(date) => {
                form.setFieldValue('startDate', date);
                form.setFieldValue('endDate', null);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label>End Date</label>
            <br />
            <DatePicker
              selected={form.values.endDate}
              onChange={(date) => form.setFieldValue('endDate', date)}
              dateFormat="dd/MM/yyyy"
              minDate={form.values.startDate}
              placeholderText="Select end date"
              className="form-control"
            />
          </div>

          <Select
            label="Status"
            placeholder="Select Status"
            data={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
            {...form.getInputProps('status')}
            required
            mt="sm"
          />

          <Select
            label="Shift"
            placeholder="Select Shift"
           
            {...form.getInputProps('shift')}
            required
            mt="sm"
          />

          <Group position="right" mt="md">
            <Button type="submit">{id ? 'Update Classroom' : 'Create New Classroom'}</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default ClassroomFormPage;

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
  const [shifts, setShifts] = useState([]); // Thêm state để lưu dữ liệu shift

  const form = useForm({
    initialValues: {
      id: '',
      teacher1Id: '',
      teacher2Id: '',
      courseId: '',
      startDate: null,
      endDate: null,
      status: 'Active',
      shift: '', // Khởi tạo shift trống
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
             // endDate: classroom.endDate ? new Date(classroom.endDate) : null,
              status: 0,
              shift: classroom.shift, // Set giá trị shift từ classroom
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

    // Fetch teachers
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

    // Fetch courses
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

    // Fetch shift options from API
    const fetchShifts = async () => {
      try {
        const res = await getRequest("/Shift/getAllShifts"); // API này bạn sẽ sửa đường dẫn
        if (res.status) {
          const formattedShifts = res.data.map(shift => {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const days = shift.dayOfWeeks.map(day => dayNames[day - 1]); // Chuyển từ số thành tên ngày
            return {
              value: shift.id, // Sử dụng shift id làm giá trị của dropdown
              label: `From: ${shift.fromTime} To: ${shift.toTime} - Days: ${days.join(', ')}`, // Hiển thị thông tin đầy đủ
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

    fetchTeachers();
    fetchCourses();
    fetchShifts(); // Gọi API lấy shifts
  }, [id]);

  const handleSubmit = async (values) => {
    const payload = {
      teacher1Id: values.teacher1Id,
      teacher2Id: values.teacher2Id,
      courseId: values.courseId,
      creatorId: getUserIdFromToken(localStorage.getItem('token')),
      startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : null,
     // endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
      status:1,
      shift: values.shift,
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
          onClick={() => window.location.replace("/admin/classroom")}
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

        <form onSubmit={form.onSubmit(handleSubmit)} className='flex flex-col gap-5'>
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
            
            className="custom-disabled-input select-none"
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
          <div className="p-field">
            <label htmlFor="shift">Shift</label>
            <Dropdown
              label="Shift"
              placeholder="Select Shift"
              options={shifts} // Hiển thị các shift đã chuyển đổi
              optionLabel="label" // Chỉ định thuộc tính dùng để hiển thị trong dropdown
              optionValue="value" // Chỉ định giá trị của mỗi mục trong dropdown
              value={form.values.shift} // Gán giá trị từ form vào dropdown
              onChange={(e) => form.setFieldValue('shift', e.value)} // Lấy giá trị khi thay đổi
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
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

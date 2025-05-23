import React, { useState, useEffect, useRef } from 'react';
import {
  Button, TextInput, Select, Group, Box, Notification
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCheck, IconX } from '@tabler/icons-react';
import { postRequest, getRequest, putRequest } from '../../../services/APIService';
import DatePicker from 'react-datepicker';  // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import css cho react-datepicker
import { Dropdown } from 'primereact/dropdown';

const ClassroomFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là update, không thì create
  const [feedback, setFeedback] = useState(null);

  const [teachers, setTeachers] = useState([]); // Mới thêm để lưu danh sách giáo viên
  const [courses, setCourses] = useState([]);  // Mới thêm để lưu danh sách khóa học

  const form = useForm({
    initialValues: {
      id: '',
      teacher1Id: '',
      teacher2Id: '',
      courseId: '',
      creatorId: '',
      startDate: null,
      endDate: null,
      status: '',
      shift: '',
    },
    validate: {
      teacher1Id: (value) => (value ? null : 'Teacher 1 is required'),
      teacher2Id: (value) => (value ? null : 'Teacher 2 is required'),
      courseId: (value) => (value ? null : 'Course ID is required'),
      status: (value) => (value ? null : 'Status is required'),
      shift: (value) => (value ? null : 'Shift is required'),
    },
  });

  useEffect(() => {
    if (id) {
      // Nếu có id thì load Classroom
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
              creatorId: classroom.creatorId,
              startDate: classroom.startDate ? new Date(classroom.startDate) : null,
              endDate: classroom.endDate ? new Date(classroom.endDate) : null,
              status: classroom.status,
              shift: classroom.shift,
            });
          } else {
            setFeedback({ type: 'error', message: 'Cannot load classroom' });
          }
        } catch (error) {
          console.error('Error fetching course:', error);
        }
      };
      fetchClassroom();
    }

    // Fetch teachers
    const fetchTeachers = async () => {
      try {
        const res = await getRequest("/user/teachers"); // Địa chỉ API để lấy danh sách giáo viên
        if (res.status) {
          setTeachers(res.data); // Lưu giáo viên vào state
        } else {
          setFeedback({ type: 'warn', message: 'No teachers found' });
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const res = await getRequest("/course"); // Địa chỉ API để lấy danh sách khóa học
        if (res.status) {
          setCourses(res.data); // Lưu khóa học vào state
        } else {
          setFeedback({ type: 'warn', message: 'No courses found' });
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchTeachers();
    fetchCourses();
  }, [id]);

  const handleSubmit = async (values) => {
    const payload = {
      teacher1Id: values.teacher1Id,
      teacher2Id: values.teacher2Id,
      courseId: values.courseId,
      creatorId: values.creatorId,
      startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : null,
      endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
      status: values.status,
      shift: values.shift,
    };
    console.log(payload)
    try {
      let result;
      if (id) {
        // Update
        result = await putRequest(`/classrooms/${id}`, payload);
      } else {
        // Create
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
      console.error('Lỗi khi submit:', error);
    }
  };

  return (
    <div className='container'>
      <div className='mb-4'>
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => {
            window.location.replace("/admin/classroom");
          }}
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
          
                    {/* Dropdown for Teacher 1 */}
          <div className="p-field">
            <label htmlFor="teacher1Id">Teacher 1</label>
            <Dropdown
              id="teacher1Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.values.teacher1Id}
              onChange={(e) => form.setFieldValue('teacher1Id', e.value)} // Cập nhật teacher1Id khi người dùng chọn
              placeholder="Select Teacher 1"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>

          {/* Dropdown for Teacher 2 */}
          <div className="p-field">
            <label htmlFor="teacher2Id">Teacher 2</label>
            <Dropdown
              id="teacher2Id"
              options={teachers}
              optionLabel="fullname"
              optionValue="id"
              value={form.values.teacher2Id}
              onChange={(e) => form.setFieldValue('teacher2Id', e.value)} // Cập nhật teacher2Id khi người dùng chọn
              placeholder="Select Teacher 2"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>

          {/* Dropdown for Course */}
          <div className="p-field">
            <label htmlFor="courseId">Course</label>
            <Dropdown
              id="courseId"
              options={courses}
              optionLabel="name"
              optionValue="id"
              value={form.values.courseId}
              onChange={(e) => form.setFieldValue('courseId', e.value)} // Cập nhật courseId khi người dùng chọn
              placeholder="Select Course"
              filter
              showClear
              className={feedback && feedback.type === 'error' ? "p-invalid" : ""}
            />
          </div>


            <TextInput label="Creator ID" {...form.getInputProps('creatorId')} required mt="sm" />
          <div className="mb-3">
            <label>Start Date</label>
            <br />
            <DatePicker
              selected={form.values.startDate}
              onChange={(date) => {
                form.setFieldValue('startDate', date);
                form.setFieldValue('endDate', null); // Reset End Date khi thay đổi Start Date
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
              onChange={(date) => form.setFieldValue('endDate', date)} // Cập nhật giá trị form
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
            data={[{ value: 'Morning', label: 'Morning' }, { value: 'Afternoon', label: 'Afternoon' }, { value: 'Evening', label: 'Evening' }]}
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

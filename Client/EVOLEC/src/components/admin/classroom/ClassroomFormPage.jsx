import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Group, Box, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCheck, IconX } from '@tabler/icons-react';
import { postRequest, getRequest, putRequest } from '../../../services/APIService';
import { Calendar } from 'primereact/calendar';  // Import Calendar từ PrimeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Import theme cho PrimeReact
import 'primereact/resources/primereact.min.css'; // Import PrimeReact core styles
import 'primeicons/primeicons.css'; // Import PrimeIcons (nếu cần sử dụng các icon)

const ClassroomFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là update, không thì create
  const [feedback, setFeedback] = useState(null);

  // Khởi tạo form với Mantine form hooks
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

  // Nếu có id thì load dữ liệu lớp học
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
  }, [id]);

  // Hàm gửi dữ liệu đến API để tạo hoặc cập nhật lớp học
  const handleSubmit = async (values) => {
    const payload = {
      id: values.id,
      teacher1Id: values.teacher1Id,
      teacher2Id: values.teacher2Id,
      courseId: values.courseId,
      creatorId: values.creatorId,
      startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : null,
      endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
      status: values.status,
      shift: values.shift,
    };

    try {
      let result;
      // Gửi API create Classroom
      if (id) {
        result = await putRequest(`/classrooms/${id}`, payload); // Cập nhật lớp học
      } else {
        result = await postRequest('/classrooms/create', payload); // Tạo mới lớp học
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
      setFeedback({ type: 'error', message: 'Có lỗi khi thực hiện thao tác!' });
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <Button
          className="!bg-transparent !text-black"
          size="xl"
          p="xs"
          onClick={() => {
            window.location.replace("/admin/classrooms");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className="font-bold text-2xl">
          {id ? 'Update Classroom' : 'Create New Classroom'}
        </span>
      </div>

      <B  ox maw={600} mx="auto">
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
          <TextInput label="Teacher 1 ID" {...form.getInputProps('teacher1Id')} required />
          <TextInput label="Teacher 2 ID" {...form.getInputProps('teacher2Id')} required mt="sm" />
          <TextInput label="Course ID" {...form.getInputProps('courseId')} required mt="sm" />
          <TextInput label="Creator ID" {...form.getInputProps('creatorId')} required mt="sm" />

          <div className="mb-3">
            <label>Start Date</label>
            <br />
            <Calendar
              value={form.values.startDate}
              onChange={(e) => form.setFieldValue('startDate', e.value)}
              dateFormat="dd/mm/yy"
              placeholder="Select start date"
            />
          </div>

          <div className="mb-3">
            <label>End Date</label>
            <br />
            <Calendar
              value={form.values.endDate}
              onChange={(e) => form.setFieldValue('endDate', e.value)}
              dateFormat="dd/mm/yy"
              minDate={form.values.startDate} // Ensure end date is after start date
              placeholder="Select end date"
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
      </B>
    </div>
  );
};

export default ClassroomFormPage;

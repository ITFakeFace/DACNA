import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Title,
  Group,
  Select,
  Loader,
  Box,
  Notification,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest, putRequest } from '../../../services/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CourseUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getRequest(`/course/${id}`);
        if (res.status) {
          const data = res.data;
          setCourse({
            courseName: data.courseName,
            courseDescription: data.courseDescription,
            bandScore: data.bandScore,
            passScore: data.passScore,
            status: data.status.toString(), // Convert sang string cho Select
          });
        } else {
          alert('Không tìm thấy khóa học');
          navigate('/admin/courses');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khóa học:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const updatedData = {
      ...course,
      status: parseInt(course.status), // Convert lại thành int
    };

    try {
      const res = await putRequest(`/course/${id}`, updatedData, token);
      if (res.status) {
        navigate('/admin/courses');
      } else {
        setFeedback({ type: 'error', message: "Cập nhật thất bại" });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật khóa học:', error);
      setFeedback({ type: 'error', message: "Cập nhật thất bại" });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!course) return null;

  return (
    <div className="container">
      <div className="mb-4">
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => {
            navigate("/admin/courses");
            window.location.reload();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className='font-bold text-2xl'>Cập nhật khóa học</span>
      </div>
      <Box>
        {feedback && (
          <Notification
            icon={feedback.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Thành công' : 'Thất bại'}
            onClose={() => setFeedback(null)}
            mb="md"
          >
            {feedback.message}
          </Notification>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
          <TextInput
            label="Tên khóa học"
            required
            value={course.courseName}
            onChange={(e) => handleChange('courseName', e.target.value)}
          />

          <Textarea
            label="Mô tả khóa học"
            value={course.courseDescription}
            onChange={(e) => handleChange('courseDescription', e.target.value)}
          />

          <NumberInput
            label="Band Score"
            required
            value={course.bandScore}
            onChange={(val) => handleChange('bandScore', val)}
            min={0}
            step={0.5}
          />

          <NumberInput
            label="Pass Score"
            required
            value={course.passScore}
            onChange={(val) => handleChange('passScore', val)}
            min={0}
            step={0.5}
          />

          <Select
            label="Trạng thái"
            required
            value={course.status}
            onChange={(val) => handleChange('status', val)}
            data={[
              { value: '1', label: 'Hoạt động' },
              { value: '0', label: 'Không hoạt động' },
            ]}
          />

          <Group position="right" mt="md">
            <Button type="submit">Cập nhật</Button>
            <Button variant="default" onClick={() => navigate('/admin/courses')}>
              Hủy
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default CourseUpdatePage;

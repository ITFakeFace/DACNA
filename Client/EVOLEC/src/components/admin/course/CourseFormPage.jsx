import React, { useEffect, useState } from 'react';
import {
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Group,
  Loader,
  Notification,
  Box
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest, postRequest, putRequest } from '../../../services/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getUserIdFromToken } from '../../../services/authService';

const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [course, setCourse] = useState({
    name: '',
    description: '',
    fullScore: 0,
    passScore: 0,
    bandScore: 0,
    creatorId: '', // Có thể lấy từ context hoặc localStorage nếu cần
    status: '1'
  });
  const [loading, setLoading] = useState(isEditMode);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await getRequest(`/course/${id}`);
          if (res.status) {
            const data = res.data;
            setCourse({
              name: data.name,
              description: data.description,
              fullScore: data.fullScore,
              passScore: data.passScore,
              bandScore: data.bandScore,
              creatorId: data.creatorId,
              status: data.status.toString()
            });
          } else {
            alert('Không tìm thấy khóa học!');
            navigate('/admin/courses');
          }
        } catch (error) {
          console.error('Lỗi khi tải khóa học:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const submitData = {
      ...course,
      status: parseInt(course.status),
    };
    if (submitData.creatorId == '')
      submitData.creatorId = getUserIdFromToken(token);
    console.log(JSON.stringify(submitData))

    try {
      const res = isEditMode
        ? await putRequest(`/course/${id}`, submitData, token)
        : await postRequest('/course', submitData, token);

      if (res.status) {
        navigate('/admin/courses');
      } else {
        setFeedback({ type: 'error', message: isEditMode ? 'Cập nhật thất bại' : 'Tạo thất bại' });
      }
    } catch (error) {
      console.error('Lỗi khi submit:', error);
      setFeedback({ type: 'error', message: isEditMode ? 'Cập nhật thất bại' : 'Tạo thất bại' });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className="mb-4">
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => navigate('/admin/courses')}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className='font-bold text-2xl'>
          {isEditMode ? 'Cập nhật khóa học' : 'Tạo khóa học mới'}
        </span>
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
            placeholder="Nhập tên khóa học"
            required
            value={course.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <Textarea
            label="Mô tả khóa học"
            placeholder="Nhập mô tả"
            value={course.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <NumberInput
            label="Full Score"
            placeholder="Nhập điểm tối đa"
            required
            value={course.fullScore}
            onChange={(val) => handleChange('fullScore', val)}
            min={0}
            step={0.5}
          />

          <NumberInput
            label="Pass Score"
            placeholder="Nhập điểm đạt"
            required
            value={course.passScore}
            onChange={(val) => handleChange('passScore', val)}
            min={0}
            step={0.5}
          />

          <NumberInput
            label="Band Score"
            placeholder="Nhập điểm band"
            required
            value={course.bandScore}
            onChange={(val) => handleChange('bandScore', val)}
            min={0}
            step={0.5}
          />

          <Select
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            required
            value={course.status}
            onChange={(val) => handleChange('status', val)}
            data={[
              { value: '1', label: 'Hoạt động' },
              { value: '0', label: 'Không hoạt động' },
            ]}
          />

          <Group position="right" mt="md">
            <Button type="submit">{isEditMode ? 'Cập nhật' : 'Tạo mới'}</Button>
            <Button variant="default" onClick={() => navigate('/admin/courses')}>
              Hủy
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default CourseFormPage;

import React, { useState } from 'react';
import { Button, TextInput, NumberInput, Textarea, Title, Group, Select } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../../../services/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CourseCreatePage = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    courseName: '',
    courseDescription: '',
    bandScore: 0,
    passScore: 0,
    status: '1'
  });

  const handleChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await postRequest("/course", course);
      if (res.status) {
        navigate("/admin/courses");
      } else {
        alert("Tạo khóa học thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo khóa học:", error);
      alert("Có lỗi xảy ra!");
    }
  };

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
        <span className='font-bold text-2xl'>Tạo khóa học mới</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
        <TextInput
          label="Tên khóa học"
          placeholder="Nhập tên khóa học"
          required
          value={course.courseName}
          onChange={(e) => handleChange('courseName', e.target.value)}
        />

        <Textarea
          label="Mô tả khóa học"
          placeholder="Nhập mô tả"
          value={course.courseDescription}
          onChange={(e) => handleChange('courseDescription', e.target.value)}
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

        <NumberInput
          label="Pass Score"
          placeholder="Nhập điểm pass"
          required
          value={course.passScore}
          onChange={(val) => handleChange('passScore', val)}
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
          <Button type="submit">Tạo khóa học</Button>
          <Button variant="default" onClick={() => navigate("/admin/courses")}>Hủy</Button>
        </Group>
      </form>
    </div>
  );
};

export default CourseCreatePage;

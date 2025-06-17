import React, { useState, useEffect } from 'react';
import { Button, Notification, TextInput } from '@mantine/core';
import { Dropdown } from 'primereact/dropdown';
import { postRequest, getRequest, putRequest } from '../../services/APIService';
import { getUserIdFromToken, getUsernameFromToken } from '../../services/authService';
import { useNavigate, useParams } from 'react-router-dom';

const EnrollmentsCreateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ params URL nếu có, giúp phân biệt giữa tạo mới và sửa

  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [classRoomId, setClassRoomId] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const creatorId = getUserIdFromToken(localStorage.getItem('token'));  // Lấy Creator ID từ Token
  const creatorName = getUsernameFromToken(localStorage.getItem('token'));

  // Fetch dữ liệu Student và Classroom
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await getRequest('/user/students');
      if (res.status) {
        const data = res.data.map((student) => ({
          label: student.fullname, // Hiển thị tên đầy đủ
          value: student.id,       // Giá trị là studentId
        }));
        setStudents(data);
      }
    };

    const fetchClassrooms = async () => {
      const res = await getRequest('/ClassRoom');
      if (res.Status) {
        const data = res.Data.$values.map((room) => ({
          label: room.$id + ' - ' + room.Course.Name,  // Hiển thị classroom id
          value: room.Id,           // Giá trị là classRoomId
        }));
        setClassrooms(data);
      }
    };

    fetchStudents();
    fetchClassrooms();

    if (id) {
      // Nếu có id, gọi API để lấy dữ liệu enrollment hiện tại
      fetchEnrollmentData(id);
    }
  }, [id]);

  // Fetch dữ liệu Enrollment khi cập nhật
  const fetchEnrollmentData = async (id) => {
    try {
      const res = await getRequest(`/enrollment/${id}`);
      console.log(res)
      if (res.status) {
        const enrollment = res.data;
        setStudentId(enrollment.studentId);
        setClassRoomId(enrollment.classRoomId);
        setEnrollDate(enrollment.enrollDate);
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error);
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!studentId || !classRoomId || !creatorId || !enrollDate) {
      setFeedback({ type: 'error', message: 'All fields are required!' });
      return;
    }

    setLoading(true);

    const payload = {
      studentId,
      classRoomId,
      creatorId,
      enrollDate,
      status: 1,  // Status mặc định là 1 (Active)
    };

    try {
      let res;
      if (id) {
        // Nếu có id, gọi API PUT để cập nhật
        res = await putRequest(`/enrollment/update/${id}`, payload);
      } else {
        // Nếu không có id, gọi API POST để tạo mới
        res = await postRequest('/enrollment/create', payload);
      }

      if (res.status) {
        setFeedback({ type: 'success', message: 'Enrollment created/updated successfully!' });
      } else {
        setFeedback({ type: 'error', message: 'Failed to create/update enrollment' });
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback({ type: 'error', message: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      {/* Back Button */}
      <Button
        type="button"
        onClick={() => navigate("/enrollment-staff/enrollments/")} // Quay lại trang danh sách
        variant="outline"
        fullWidth
        style={{ marginTop: '10px' }}
      >
        Back
      </Button>

      <form onSubmit={handleSubmit}>
        {feedback && (
          <Notification
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Success' : 'Error'}
            disallowClose
          >
            {feedback.message}
          </Notification>
        )}

        {/* Dropdown for Student */}
        <div className="p-field mb-3">
          <label>Student</label>
          <Dropdown
            value={studentId}
            options={students}
            onChange={(e) => setStudentId(e.value)} // Set studentId khi thay đổi
            placeholder="Select Student"
            filter
            showClear
          />
        </div>

        {/* Dropdown for Classroom */}
        <div className="p-field mb-3">
          <label>Classroom</label>
          <Dropdown
            value={classRoomId}
            options={classrooms}
            onChange={(e) => setClassRoomId(e.value)} // Set classRoomId khi thay đổi
            placeholder="Select Classroom"
            filter
            showClear
          />
        </div>

        {/* Creator Id */}
        <TextInput
          label="Creator"
          value={creatorName}
          disabled
          className="custom-disabled-input select-none mb-3"
        />

        {/* Enroll Date */}
        <TextInput
          label="Enrollment Date"
          type="date"
          value={enrollDate}
          onChange={(e) => setEnrollDate(e.target.value)} // Set enrollDate khi thay đổi
          required
          className="mb-3"
        />

        {/* Submit Button */}
        <Button type="submit" loading={loading} fullWidth>
          {id ? 'Update Enrollment' : 'Create Enrollment'}
        </Button>
      </form>
    </div>
  );
};

export default EnrollmentsCreateForm;

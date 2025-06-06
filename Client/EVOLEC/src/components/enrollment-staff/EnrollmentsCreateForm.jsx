import React, { useState, useEffect } from 'react';
import { Button, Notification, TextInput } from '@mantine/core';
import { Dropdown } from 'primereact/dropdown';
import { postRequest, getRequest } from '../../services/APIService';
import { getUserIdFromToken } from '../../services/authService';

const EnrollmentsCreateForm = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [classRoomId, setClassRoomId] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const creatorId = getUserIdFromToken(localStorage.getItem('token'));  // Lấy Creator ID từ Token

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
      console.log(res.Data.$values)
      if (res.status) {
        console.log(res)
        const data = res.Data.$values.map((room) => ({
          label: room.Id,   // Hiển thị classroom id
          value: room.Id,     // Giá trị là classRoomId
        }));
        console.log("Data: ")
        console.log(data)
        setClassrooms(data);
      }
    };

    fetchStudents();
    fetchClassrooms();
  }, []);

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
      const res = await postRequest('/enrollments', payload); // Gọi API để tạo enrollment
      if (res.status) {
        setFeedback({ type: 'success', message: 'Enrollment created successfully!' });
      } else {
        setFeedback({ type: 'error', message: 'Failed to create enrollment' });
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
          value={creatorId}
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
          Create Enrollment
        </Button>
      </form>
    </div>
  );
};

export default EnrollmentsCreateForm;

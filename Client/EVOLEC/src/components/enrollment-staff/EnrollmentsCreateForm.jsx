import React, { useState, useEffect } from 'react';
import { Button, Notification, TextInput } from '@mantine/core';
import { Dropdown } from 'primereact/dropdown';
import { postRequest, getRequest, putRequest } from '../../services/APIService';
import { getUserIdFromToken, getUsernameFromToken } from '../../services/authService';
import { useNavigate, useParams } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EnrollmentsCreateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [classRoomId, setClassRoomId] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const creatorId = getUserIdFromToken(localStorage.getItem('token'));
  const creatorName = getUsernameFromToken(localStorage.getItem('token'));

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await getRequest('/user/students');
      if (res.status) {
        const data = res.data.map((student) => ({
          label: student.fullname,
          value: student.id,
        }));
        setStudents(data);
      }
    };

    const fetchClassrooms = async () => {
      const res = await getRequest('/ClassRoom');
      if (res.Status) {
        const data = res.Data.$values.map((room) => ({
          label: room.$id + ' - ' + room.Course.Name,
          value: room.Id,
        }));
        setClassrooms(data);
      }
    };

    fetchStudents();
    fetchClassrooms();

    if (id) {
      fetchEnrollmentData(id);
    }
  }, [id]);

  const fetchEnrollmentData = async (id) => {
    try {
      const res = await getRequest(`/enrollment/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      status: 1,
    };

    try {
      let res;
      if (id) {
        res = await putRequest(`/enrollment/update/${id}`, payload);
      } else {
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
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '32px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/enrollment-staff/enrollments/')}
        style={{
          background: 'none',
          border: 'none',
          color: '#1f2937',
          fontWeight: 600,
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span style={{ marginLeft: '10px' }}>Back</span>
      </button>

      <form onSubmit={handleSubmit}>
        {feedback && (
          <Notification
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Success' : 'Error'}
            disallowClose
            style={{ marginBottom: '20px' }}
          >
            {feedback.message}
          </Notification>
        )}

        {/* Student Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Student</label>
          <Dropdown
            value={studentId}
            options={students}
            onChange={(e) => setStudentId(e.value)}
            placeholder="Select Student"
            filter
            showClear
            style={{ width: '100%' }}
          />
        </div>

        {/* Classroom Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Classroom</label>
          <Dropdown
            value={classRoomId}
            options={classrooms}
            onChange={(e) => setClassRoomId(e.value)}
            placeholder="Select Classroom"
            filter
            showClear
            style={{ width: '100%' }}
          />
        </div>

        {/* Creator Display */}
        <div style={{ marginBottom: '20px' }}>
          <TextInput
            label="Creator"
            value={creatorName}
            disabled
            styles={{
              input: {
                backgroundColor: '#f9fafb',
                cursor: 'not-allowed',
              },
            }}
          />
        </div>

        {/* Enrollment Date */}
        <div style={{ marginBottom: '20px' }}>
          <TextInput
            label="Enrollment Date"
            type="date"
            value={enrollDate}
            onChange={(e) => setEnrollDate(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" loading={loading} fullWidth>
          {id ? 'Update Enrollment' : 'Create Enrollment'}
        </Button>
      </form>
    </div>
  );
};

export default EnrollmentsCreateForm;

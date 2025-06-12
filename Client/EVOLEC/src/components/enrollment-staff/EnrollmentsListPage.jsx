import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title, TextInput } from '@mantine/core';
import { getRequest } from '../../services/APIService';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

const EnrollmentsListPage = () => {
  const emptyEnrollment = {
    id: null,
    studentId: null,
    classRoomId: null,
    creatorId: null,
    enrollDate: null,
    status: null,
  };

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [enrollment, setEnrollment] = useState(emptyEnrollment);

  const navigate = useNavigate(); // Hook để chuyển hướng người dùng

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await getRequest('/enrollment');
     
      
      if (res.status) {
        setEnrollments(res.data); // Lưu dữ liệu vào state
      }
     
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(); // Fetch enrollments on component mount
  }, []);

  const deleteEnrollmentClick = async () => {
    try {
      const res = await getRequest(`/enrollments/delete/${enrollment.id}`);
      if (res.status) {
        const updatedEnrollments = enrollments.filter(e => e.id !== enrollment.id);
        setEnrollments(updatedEnrollments);
        setEnrollment(emptyEnrollment); // Reset enrollment state
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
    }
  };

  const confirmDeleteEnrollment = (enrollment) => {
    setEnrollment(enrollment);
  };

  const renderStatus = (rowData) => {
    
    return rowData.status == 1 ? (
      <Button size="xs" color="green">Active</Button>
    ) : (
      <Button size="xs" color="red">Inactive</Button>
    );
  };

  const renderActions = (rowData) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button size="xs" onClick={() => navigate(`/enrollment-staff/enrollments/update/${rowData.$id}`)}>Edit</Button>
        <Button size="xs" color="red" onClick={() => confirmDeleteEnrollment(rowData)}>Delete</Button>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const tableHeader = (
    <div className="flex justify-between items-center mb-3">
      <Button onClick={fetchEnrollments} loading={loading}>Refresh</Button>
      <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." />
    </div>
  );

  // Cấu hình các cột cho DataTable
  const columns = [
    { name: 'ID', selector: row => row.enrollmentId, sortable: true },
    { name: 'Student Name', selector: row => row.studentName, sortable: true },
    { name: 'Classroom ID', selector: row => row.classRoomName, sortable: true },
    { name: 'Creator ID', selector: row => row.creatorName, sortable: true },
    { name: 'Enroll Date', selector: row => row.enrollDate, sortable: true },
    {
      name: 'Status',
      selector: row => renderStatus(row),
      sortable: true,
      center: true,
    },
    {
      name: 'Actions',
      selector: row => renderActions(row),
      sortable: false,
      center: true,
      minWidth: '280px',
    },
  ];

  return (
    <div className="container">
      <Title mb={20}>Enrollments List</Title>
      <div>
        <Button onClick={() => navigate('/enrollment-staff/enrollments/create')}>Create New Enrollment</Button>
      </div>

      {loading ? (
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      ) : (
        <DataTable
          columns={columns}
          data={enrollments}
          pagination
          highlightOnHover
          responsive
          fixedHeader
          filterable
          globalFilter={globalFilterValue}
        />
      )}
    </div>
  );
};

export default EnrollmentsListPage;

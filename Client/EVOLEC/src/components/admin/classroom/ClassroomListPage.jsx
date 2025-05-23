import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title } from '@mantine/core';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../services/APIService'; // Giả sử có các hàm API


const ClassroomListPage = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch danh sách Classroom từ API
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const data = await getRequest("/classrooms"); // Gọi API Classroom
        setClassrooms(data.data); // Giả sử API trả về danh sách Classroom trong `data.data`
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Cấu hình các cột cho DataTable
  const columns = [
    { name: 'Classroom ID', selector: row => row.Id, sortable: true },
    { name: 'Teacher 1', selector: row => row.Teacher1Id, sortable: true },
    { name: 'Teacher 2', selector: row => row.Teacher2Id, sortable: true },
    { name: 'Course ID', selector: row => row.CourseId, sortable: true },
    { name: 'Status', selector: row => row.Status, sortable: true },
    {
      name: 'Actions',
      selector: row => (
        <div className="flex gap-2 justify-center">
          <Button size="xs" onClick={() => navigate(`/classrooms/${row.Id}`)}>Details</Button>
          <Button size="xs" onClick={() => navigate(`/classrooms/update/${row.Id}`)}>Edit</Button>
          <Button size="xs" color="red">Delete</Button>
        </div>
      ),
      sortable: false,
      center: true,
      minWidth: '280px',
    },
  ];
  return (
    <div className="container">
      <Title mb={20}>Classroom List</Title>
      <div>
        <Button onClick={() => navigate("/admin/class/create")}>Create new Classroom</Button>
      </div>
      {loading ? <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} /> :
        <DataTable
          columns={columns}
          data={classrooms}
          pagination
          highlightOnHover
          responsive
          fixedHeader
        />}
    </div>
  );
};

export default ClassroomListPage;

import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title } from '@mantine/core';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../services/APIService'; // Giả sử có các hàm API


const ClassroomListPage = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClassroom = async () => {
    try {
      const data = await getRequest("/classroom"); // Gọi API lấy danh sách khóa học
      
      // console.log("----------------------------------");
      // console.log("API Response:", data);
      // console.log("ID API Response:", data.$id);
      // console.log("Data API Response:", data.Data);
      // console.log("Data value API Response:", data.Data.$values);
      // console.log("satus API Response:", data.Status);
      // console.log("----------------------------------");

      
      if (data.Status) {
        setClassrooms(data.Data.$values);
        // console.log("------------------11111111111111111111")
        // console.log(data.Data.$values)
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  // Fetch courses data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchClassroom();
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  // Cấu hình các cột cho DataTable
  const columns = [
    { name: 'Classroom ID', selector: row => row.$id, sortable: true },
    { name: 'Teacher 1', selector: row => row.Teacher1.Username, sortable: true },
    { name: 'Teacher 2', selector: row => row.Teacher2.Username, sortable: true },
    { name: 'Course ID', selector: row => row.Course.Name, sortable: true },
    // { name: 'Status', selector: row => row.Status, sortable: true },
     {
          name: 'Status',
          selector: row => {
            return row.Status == 1
              ? <Button color='green'>Active</Button>
              : <Button color='red'>Inactive</Button>;
          },
          sortable: true,
          center: true,
        },
    {
      name: 'Actions',
      selector: row => (
        <div className="flex gap-2 justify-center">
           
          <Button size="xs" onClick={() => navigate(`/admin/classrooms/${row.Id}`)}>Details</Button>
          <Button size="xs" onClick={() => navigate(`/classrooms/update/${row.$id}`)}>Edit</Button>
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
        <Button onClick={() => navigate("/admin/classrooms/create")}>Create new Classroom</Button>
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

import React, { useEffect, useState } from 'react';
import { Button, Title } from '@mantine/core';
import DataTable from 'react-data-table-component'; // Import react-data-table-component
import { getRequest } from '../../../services/APIService';
import { useNavigate } from 'react-router-dom';
import './CourseListPage.css';

const CourseListPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Fetch courses data when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getRequest("/course"); // Gọi API lấy danh sách khóa học
        if (data.status) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      }
    };
    fetchCourses();
  }, []);

  const columns = [
    { name: 'Tên khóa', selector: row => row.courseName, sortable: true },
    { name: 'Điểm band', selector: row => row.bandScore, sortable: true, center: true },
    { name: 'Điểm pass', selector: row => row.passScore, sortable: true, center: true },
    {
      name: 'Trạng thái',
      selector: row => {
        return row.status === 1
          ? <Button color='green'>Hoạt động</Button>
          : <Button color='red'>Không hoạt động</Button>;
      },
      sortable: true,
      center: true,
    },
    {
      name: '',
      selector: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <Button size="xs"
              onClick={() => console.log('Chi tiết khóa học:', row.id)}
            >
              Chi tiết
            </Button>
            <Button size="xs" className="!bg-cyan-500"
              onClick={() => navigate(`/admin/courses/update/${row.id}`)}
            >
              Cập nhật
            </Button>
            <Button size="xs" color="red"
              onClick={() => handleDelete(row.id)}
            >
              Xóa
            </Button>
          </div>
        );
      },
      sortable: false,
      center: true,
      minWidth: '280px',
    },
  ];

  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        justifyContent: 'center',
      },
    },
  };

  return (
    <div className="container">
      <Title mb={20}>Danh sách khóa học</Title>
      <div>
        <Button onClick={() => navigate("/admin/courses/create")}>Tạo khóa học mới</Button>
      </div>
      <DataTable
        className='w-full data-table'
        columns={columns}   // Cập nhật lại cách khai báo cột
        data={courses}      // Dữ liệu sẽ là `courses`
        pagination           // Bật phân trang
        highlightOnHover     // Hiển thị hiệu ứng hover
        responsive           // Đảm bảo responsive cho màn hình nhỏ
        fixedHeader          // Đảm bảo header cố định
        customStyles={tableCustomStyles}
      />
    </div>
  );
};

export default CourseListPage;

import React, { useEffect, useState } from 'react';
import { Button, Loader, LoadingOverlay, Title, UnstyledButton } from '@mantine/core';
import DataTable from 'react-data-table-component';  // Import react-data-table-component
import { getRequest } from '../../../services/APIService';
import './AccountListPage.css';
import { useNavigate } from 'react-router-dom';

const AccountListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getRequest("/user");
        if (data.status) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { name: 'Họ tên', selector: row => row.fullname, sortable: true },
    {
      name: 'Giới tính',
      selector: row => row.gender == 1 ? <button className='bg-blue-500 text-white pl-5 pr-5 pt-2 pb-2 rounded-md'>Nam</button> : <button className='bg-pink-400 text-white pl-5 pr-5 pt-2 pb-2 rounded-md'>Nữ</button>,
      sortable: true,
      center: true,
      sortFunction: (a, b) => {
        const genderA = a.gender === 1 ? 'Nam' : 'Nữ';
        const genderB = b.gender === 1 ? 'Nam' : 'Nữ';
        return genderA.localeCompare(genderB);
      },
    },
    { name: 'Ngày sinh', selector: row => row.dob, sortable: true, center: true },
    { name: 'Email', selector: row => row.email, sortable: true, center: true },
    { name: 'SĐT', selector: row => row.phoneNumber, sortable: true, center: true },
    {
      name: 'Vị trí',
      selector: row => {
        switch (row.role) {
          case 'ADMIN':
            return <Button color='red'>Quản trị</Button>;
          case 'STAFF':
            return <Button color='blue'>Nhân viên</Button>;
          case 'TEACHER':
            return <Button color='green'>Giáo viên</Button>;
          case 'STUDENT':
            return <Button color='gray'>Học viên</Button>;
          default:
            return <Button color='dark'>Không rõ</Button>;
        }
      }, sortable: true, center: true, sortFunction: (a, b) => a.role.localeCompare(b.role),
    },
    {
      name: 'Tình trạng', selector: row => {
        return (row.lockout == null
          ? <Button color='green'>Hoạt động</Button>
          : <Button color='red'>Khóa</Button>
        );
      }, sortable: true, center: true,
    },
    {
      name: '',
      selector: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <Button size="xs"
              onClick={() => console.log('Xem chi tiết:', row.id)}
            >
              Chi tiết
            </Button>
            <Button size="xs" className="!bg-cyan-500"
              onClick={() => navigate(`/admin/accounts/update/${row.id}`)}
            >
              Cập nhật
            </Button>
            <Button size="xs" color="red"
              onClick={() => handleDelete(row.id)}
            >Xóa</Button>
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
  }

  return (
    <div className="container">
      <Title mb={20}>Danh sách tài khoản</Title>
      <div>
        <Button onClick={() => navigate("/admin/accounts/create")}>Tạo tài khoản mới</Button>
      </div>
      {
        loading ? <LoadingOverlay /> : <DataTable
          className='w-full data-table'
          columns={columns}   // Cập nhật lại cách khai báo cột
          data={users}        // Dữ liệu sẽ là `users`
          pagination           // Bật phân trang
          highlightOnHover     // Hiển thị hiệu ứng hover
          responsive           // Đảm bảo responsive cho màn hình nhỏ
          fixedHeader          // Đảm bảo header cố định
          customStyles={tableCustomStyles}
        />
      }

    </div>
  );
};

export default AccountListPage;

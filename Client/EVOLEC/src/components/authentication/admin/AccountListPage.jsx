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
    { name: 'Fullname', selector: row => row.fullname, sortable: true },
    {
      name: 'Gender',
      selector: row => row.gender == 1 ? <button className='bg-blue-500 text-white pl-5 pr-5 pt-2 pb-2 rounded-md'>Male</button> : <button className='bg-pink-400 text-white pl-5 pr-5 pt-2 pb-2 rounded-md'>Female</button>,
      sortable: true,
      center: true,
      sortFunction: (a, b) => {
        const genderA = a.gender === 1 ? 'Male' : 'Female';
        const genderB = b.gender === 1 ? 'Male' : 'Female';
        return genderA.localeCompare(genderB);
      },
    },
    { name: 'Date of Birth', selector: row => row.dob, sortable: true, center: true },
    { name: 'Email', selector: row => row.email, sortable: true, center: true },
    { name: 'Phone', selector: row => row.phoneNumber, sortable: true, center: true },
    {
      name: 'Role',
      selector: row => {
        switch (row.role) {
          case 'ADMIN':
            return <Button color='red'>Admin</Button>;
          case 'ACADEMIC_ADMIN':
            return <Button color='blue'>Academic</Button>;
          case 'ENROLLMENT_STAFF':
            return <Button color='cyan'>Enrollment</Button>;
          case 'TEACHER':
            return <Button color='green'>Teacher</Button>;
          case 'STUDENT':
            return <Button color='grape'>Student</Button>;
          default:
            return <Button color='dark'>Undefined</Button>;
        }
      }, sortable: true, center: true, sortFunction: (a, b) => a.role.localeCompare(b.role),
    },
    {
      name: 'Status', selector: row => {
        return (row.lockout == null
          ? <Button color='green'>Active</Button>
          : <Button color='red'>Inactive</Button>
        );
      }, sortable: true, center: true,
    },
    {
      name: '',
      selector: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <Button size="xs"
              onClick={() => console.log('Details:', row.id)}
            >
              Details
            </Button>
            <Button size="xs" className="!bg-cyan-500"
              onClick={() => navigate(`/admin/accounts/update/${row.id}`)}
            >
              Edit
            </Button>
            <Button size="xs" color="red"
              onClick={() => handleDelete(row.id)}
            >Delete</Button>
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
      <Title mb={20}>List of Accounts</Title>
      <div>
        <Button onClick={() => navigate("/admin/accounts/create")}>Create new Account</Button>
      </div>
      {
        loading ? <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} /> : <DataTable
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

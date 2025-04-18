import React, { useState } from 'react';
import {
  Button, TextInput, PasswordInput, Select, Group, Box,
  Title, Textarea, Notification
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconX } from '@tabler/icons-react';
import './AccountListPage.css';
import { postRequest } from '../../../services/APIService';

const AccountCreatePage = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);

  const form = useForm({
    initialValues: {
      userName: '',
      email: '',
      phone: '',
      pid: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      dob: null,
      gender: '',
      address: '',
      role: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Mật khẩu không khớp' : null,
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem('token');
    const payload = {
      userName: values.userName,
      email: values.email,
      phone: values.phone,
      pid: values.pid,
      password: values.password,
      confirmPassword: values.confirmPassword,
      fullname: values.fullname,
      dob: values.dob.toISOString().split('T')[0],
      gender: parseInt(values.gender),
      address: values.address,
      role: values.role,
    };
    console.log(JSON.stringify(payload));
    try {

      const result = await postRequest('/user', payload);

      if (result.status) {
        setFeedback({ type: 'success', message: result.statusMessage });
        setTimeout(() => {
          navigate("/admin/accounts");
          window.location.reload(); // optional nếu cần reload dữ liệu
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.statusMessage || 'Tạo user thất bại' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Lỗi khi gửi yêu cầu tạo user' });
    }
  };

  return (
    <div className='container'>
      <div className='mb-4'>
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => {
            navigate("/admin/accounts");
            window.location.reload();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className='font-bold text-2xl'>Tạo tài khoản mới</span>
      </div>

      <Box maw={600} mx="auto">
        {feedback && (
          <Notification
            icon={feedback.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Thành công' : 'Thất bại'}
            onClose={() => setFeedback(null)}
            mb="md"
          >
            {feedback.message}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Tên đăng nhập" {...form.getInputProps('userName')} required />
          <TextInput label="Email" {...form.getInputProps('email')} required mt="sm" />
          <TextInput label="Số điện thoại" {...form.getInputProps('phone')} required mt="sm" />
          <TextInput label="CMND/CCCD" {...form.getInputProps('pid')} required mt="sm" />
          <TextInput label="Họ tên" {...form.getInputProps('fullname')} required mt="sm" />
          <DateInput label="Ngày sinh" placeholder="Chọn ngày" {...form.getInputProps('dob')} required mt="sm" />
          <Select
            label="Giới tính"
            placeholder="Chọn giới tính"
            data={[
              { value: '1', label: 'Nam' },
              { value: '0', label: 'Nữ' },
            ]}
            {...form.getInputProps('gender')}
            required
            mt="sm"
          />
          <Textarea label="Địa chỉ" {...form.getInputProps('address')} mt="sm" />
          <PasswordInput label="Mật khẩu" {...form.getInputProps('password')} required mt="sm" />
          <PasswordInput label="Nhập lại mật khẩu" {...form.getInputProps('confirmPassword')} required mt="sm" />
          <Select
            label="Vai trò"
            placeholder="Chọn quyền hạn"
            data={[
              { value: 'ADMIN', label: 'Quản trị viên' },
              { value: 'STAFF', label: 'Nhân viên' },
              { value: 'TEACHER', label: 'Giáo viên' },
              { value: 'STUDENT', label: 'Học sinh' },
            ]}
            {...form.getInputProps('role')}
            required
            mt="sm"
          />
          <Group position="right" mt="md">
            <Button type="submit">Tạo tài khoản</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default AccountCreatePage;

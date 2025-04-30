import React, { useState, useEffect } from 'react';
import {
  Button, TextInput, PasswordInput, Select, Group, Box,
  Textarea, Notification
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCheck, IconX } from '@tabler/icons-react';
import { postRequest, getRequest, putRequest } from '../../../services/APIService';
import './AccountFormPage.css'; // Bạn có thể đổi tên file css

const AccountFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là update, không thì create
  const [feedback, setFeedback] = useState(null);

  const form = useForm({
    initialValues: {
      id: '',
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

  useEffect(() => {
    if (id) {
      // Nếu có id thì load user
      const fetchUser = async () => {
        try {
          const res = await getRequest(`/user/${id}`);
          if (res && res.status && res.data) {
            const user = res.data;
            form.setValues({
              id: user.id,
              userName: user.userName,
              email: user.email,
              phone: user.phoneNumber,
              pid: user.pid,
              password: '',
              confirmPassword: '',
              fullname: user.fullname,
              dob: user.dob ? new Date(user.dob) : null,
              gender: user.gender?.toString() || '',
              address: user.address || '',
              role: user.role,
            });
          } else {
            setFeedback({ type: 'error', message: 'Không tìm thấy người dùng' });
          }
        } catch (err) {
          setFeedback({ type: 'error', message: 'Lỗi khi tải thông tin người dùng' });
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    const payload = {
      id: values.id,
      userName: values.userName,
      email: values.email,
      phone: values.phone,
      pid: values.pid,
      password: values.password,
      confirmPassword: values.confirmPassword,
      fullname: values.fullname,
      dob: values.dob ? values.dob.toISOString().split('T')[0] : null,
      gender: parseInt(values.gender),
      address: values.address,
      role: values.role,
    };

    try {
      let result;
      if (id) {
        // Update
        result = await putRequest(`/user/${id}`, payload);
      } else {
        // Create
        result = await postRequest('/user', payload);
      }

      if (result.status) {
        setFeedback({ type: 'success', message: result.statusMessage });
        setTimeout(() => {
          navigate("/admin/accounts");
          window.location.reload();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.statusMessage || (id ? 'Cập nhật thất bại' : 'Tạo user thất bại') });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: id ? 'Lỗi khi gửi yêu cầu cập nhật' : 'Lỗi khi gửi yêu cầu tạo user' });
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
            window.location.replace("/admin/accounts");
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
        <span className='font-bold text-2xl'>
          {id ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
        </span>
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
          <TextInput label="Tên đăng nhập" {...form.getInputProps('userName')} required disabled={!!id} />
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
          <PasswordInput
            label={id ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
            {...form.getInputProps('password')}
            required={!id}
            mt="sm"
          />
          <PasswordInput
            label={id ? "Nhập lại mật khẩu mới" : "Nhập lại mật khẩu"}
            {...form.getInputProps('confirmPassword')}
            required={!id}
            mt="sm"
          />
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
            <Button type="submit">{id ? 'Cập nhật' : 'Tạo tài khoản'}</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default AccountFormPage;

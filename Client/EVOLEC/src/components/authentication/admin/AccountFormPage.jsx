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
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid Email'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Password and Confirm Password does not match' : null,
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
            setFeedback({ type: 'error', message: 'Cannot load user' });
          }
        } catch (err) {
          setFeedback({ type: 'error', message: 'Cannot load user' });
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
        setFeedback({ type: 'error', message: result.statusMessage || (id ? 'Failed to Update Account' : 'Failed to Create Account') });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: id ? 'Failed to request Update User' : 'Failed to request Create User' });
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
          {id ? 'Update' : 'Create New'}
        </span>
      </div>

      <Box maw={600} mx="auto">
        {feedback && (
          <Notification
            icon={feedback.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
            color={feedback.type === 'success' ? 'teal' : 'red'}
            title={feedback.type === 'success' ? 'Success' : 'Failed'}
            onClose={() => setFeedback(null)}
            mb="md"
          >
            {feedback.message}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Username" {...form.getInputProps('userName')} required disabled={!!id} />
          <TextInput label="Email" {...form.getInputProps('email')} required mt="sm" />
          <TextInput label="Phone Number" {...form.getInputProps('phone')} required mt="sm" />
          <TextInput label="Personal Identified Number" {...form.getInputProps('pid')} required mt="sm" />
          <TextInput label="Fullname" {...form.getInputProps('fullname')} required mt="sm" />
          <DateInput label="Date of Birth" placeholder="Chọn ngày" {...form.getInputProps('dob')} required mt="sm" />
          <Select
            label="Gender"
            placeholder="Choose Gender"
            data={[
              { value: '1', label: 'Male' },
              { value: '0', label: 'Female' },
            ]}
            {...form.getInputProps('gender')}
            required
            mt="sm"
          />
          <Textarea label="Address" {...form.getInputProps('address')} mt="sm" />
          <PasswordInput
            label={id ? "New Password (if changing)" : "Password"}
            {...form.getInputProps('password')}
            required={!id}
            mt="sm"
          />
          <PasswordInput
            label={id ? "Enter confirm new password" : "Enter confirm password"}
            {...form.getInputProps('confirmPassword')}
            required={!id}
            mt="sm"
          />
          <Select
            label="Role"
            placeholder="Select Role"
            data={[
              { value: 'ADMIN', label: 'Administrator' },
              { value: 'ACADEMIC_ADMIN', label: 'Academic Admin' },
              { value: 'Training_STAFF', label: 'Training Staff' },
              { value: 'TEACHER', label: 'Teacher' },
              { value: 'STUDENT', label: 'Student' },
            ]}
            {...form.getInputProps('role')}
            required
            mt="sm"
          />
          <Group position="right" mt="md">
            <Button type="submit">{id ? 'Update' : 'Create New'}</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
};

export default AccountFormPage;

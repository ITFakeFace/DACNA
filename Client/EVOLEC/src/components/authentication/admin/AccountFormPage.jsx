import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { postRequest, getRequest, putRequest } from '../../../services/APIService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { classNames } from 'primereact/utils';
import './AccountDetailsPage.css'
import { addToast } from '../../../utils/toastUtil';
import { Toast } from 'primereact/toast';
const genderOptions = [
  { label: 'Male', value: '1' },
  { label: 'Female', value: '0' },
];

const roleOptions = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'ACADEMIC_ADMIN', label: 'Academic Admin' },
  { value: 'Training_STAFF', label: 'Training Staff' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
];

const AccountFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
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
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const toastRef = useRef();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await getRequest(`/user/${id}`);
          if (res?.status && res.data) {
            const user = res.data;
            setForm({
              ...form,
              id: user.id,
              userName: user.userName,
              email: user.email,
              phone: user.phoneNumber,
              pid: user.pid,
              fullname: user.fullname,
              dob: user.dob ? new Date(user.dob) : null,
              gender: user.gender?.toString() || '',
              address: user.address || '',
              role: user.role,
              password: '',
              confirmPassword: '',
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

  const validate = () => {
    const newErrors = {};
    if (!form.userName) newErrors.userName = 'Username is required';
    if (!form.email || !/^\S+@\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone) newErrors.phone = 'Phone is required';
    if (!form.pid) newErrors.pid = 'PID is required';
    if (!form.fullname) newErrors.fullname = 'Fullname is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (!id && !form.password) newErrors.password = 'Password is required';
    if (!id && form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (id && form.password && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      dob: form.dob ? form.dob.toISOString().split('T')[0] : null,
      gender: parseInt(form.gender),
    };

    try {
      const result = id
        ? await putRequest(`/user/${id}`, payload)
        : await postRequest('/user', payload);

      if (result.status) {
        setFeedback({ type: 'success', message: result.statusMessage });
        addToast(toastRef, 'Success', "User successfully created", 'success');
        setTimeout(() => {
          navigate('/admin/accounts', { state: { refresh: true } });
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.statusMessage || 'Operation failed' });
        addToast(toastRef, 'Error', result.statusMessage, 'error');
      }
    } catch (err) {
      addToast(toastRef, 'Error', err.response.data.statusMessage, 'error');
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  return (
    <div className="p-5 max-w-2xl w-full mx-auto">
      <Toast ref={toastRef} />

      <div className="mb-4 flex items-center gap-4">
        <Button icon="pi pi-arrow-left" severity="secondary" className='!bg-transparent !border-none !text-black !font-semibold' onClick={() => navigate('/admin/accounts')} />
        <h2 className="text-2xl font-bold">{id ? 'Update Account' : 'Create New Account'}</h2>
      </div>

      {feedback && (
        <Message
          severity={feedback.type === 'success' ? 'success' : 'error'}
          text={feedback.message}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

        {/* Username */}
        <div>
          <label htmlFor="userName" className="block font-medium mb-1">Username</label>
          <InputText id="userName" value={form.userName} disabled={!!id}
            onChange={(e) => handleChange('userName', e.target.value)}
            className="w-full"
          />
          {errors.userName && <small className="p-error">{errors.userName}</small>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <InputText id="email" value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full"
          />
          {errors.email && <small className="p-error">{errors.email}</small>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
          <InputText id="phone" value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full"
          />
          {errors.phone && <small className="p-error">{errors.phone}</small>}
        </div>

        {/* PID */}
        <div>
          <label htmlFor="pid" className="block font-medium mb-1">Personal ID</label>
          <InputText id="pid" value={form.pid}
            onChange={(e) => handleChange('pid', e.target.value)}
            className="w-full"
          />
          {errors.pid && <small className="p-error">{errors.pid}</small>}
        </div>

        {/* Fullname */}
        <div>
          <label htmlFor="fullname" className="block font-medium mb-1">Fullname</label>
          <InputText id="fullname" value={form.fullname}
            onChange={(e) => handleChange('fullname', e.target.value)}
            className="w-full"
          />
          {errors.fullname && <small className="p-error">{errors.fullname}</small>}
        </div>

        {/* DOB */}
        <div>
          <label htmlFor="dob" className="block font-medium mb-1">Date of Birth</label>
          <Calendar id="dob" value={form.dob}
            onChange={(e) => handleChange('dob', e.value)}
            dateFormat="yy-mm-dd"
            showIcon
            className="w-full"
          />
          {errors.dob && <small className="p-error">{errors.dob}</small>}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block font-medium mb-1">Gender</label>
          <Dropdown
            id="gender"
            value={form.gender}
            onChange={(e) => handleChange('gender', e.value)}
            options={genderOptions}
            placeholder="Select Gender"
            className="w-full"
          />
          {errors.gender && <small className="p-error">{errors.gender}</small>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block font-medium mb-1">Address</label>
          <InputText
            id="address"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            {id ? 'New Password (if changing)' : 'Password'}
          </label>
          <Password
            id="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            toggleMask
            feedback={false}
            className="w-full"
          />
          {errors.password && <small className="p-error">{errors.password}</small>}
        </div>

        {/* Confirm Password */}
        <div className='w-full'>
          <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirm Password</label>
          <Password
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            toggleMask
            feedback={false}
            className="w-full"
            pt={{
              input: {
                className: classNames('flex w-full')
              },
              iconField: {
                className: classNames("w-full")
              },
              showicon: {
                className: classNames('absolute top-1/2 right-1')
              },
              hideicon: {
                className: classNames('absolute top-1/2 right-1')
              },
            }}
          />
          {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block font-medium mb-1">Role</label>
          <Dropdown
            id="role"
            value={form.role}
            onChange={(e) => handleChange('role', e.value)}
            options={roleOptions}
            placeholder="Select Role"
            className="w-full"

          />
          {errors.role && <small className="p-error">{errors.role}</small>}
        </div>

        {/* Submit */}
        <div className="text-right">
          <Button label={id ? 'Update' : 'Create'} icon="pi pi-check" />
        </div>
      </form>
    </div>
  );
};

export default AccountFormPage;

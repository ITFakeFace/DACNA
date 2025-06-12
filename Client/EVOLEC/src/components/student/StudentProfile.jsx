import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';

import { getUserIdFromToken } from '../../services/authService';
import { getRequest, putRequest } from '../../services/APIService'; // Sửa path tùy theo dự án

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    dob: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const toast = React.useRef(null);
  const userId = getUserIdFromToken(localStorage.getItem('token'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(userId);
        const res = await getRequest(`/user/${userId}`); // Sửa đường dẫn API lấy user theo ID
        console.log(res)
        if (res.status && res.data) {
          setProfile({
            fullName: res.data.fullname || '',
            dob: res.data.dob || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
           
          });
        } else {
          toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Không lấy được dữ liệu profile' });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lỗi khi lấy dữ liệu profile' });
        console.error(error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Chuẩn bị payload theo API backend yêu cầu, sửa fields nếu cần
      const payload = {
        Fullname: profile.fullName,
        Dob: profile.dob,
        Email: profile.email,
        PhoneNumber: profile.phoneNumber,
        Address: profile.address
      };
      console.log(payload)
      const res  = await putRequest(`/user/${userId}`, payload); // Sửa API update profile
      if (res.status) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cập nhật thông tin thành công' });
      } else {
        toast.current.show({ severity: 'error', summary: 'Failed', detail: 'Cập nhật thất bại' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lỗi khi cập nhật thông tin' });
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Toast ref={toast} />
      <Card title="Thông tin cá nhân">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Avatar label={profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'} size="xlarge" shape="circle" />
          <div>
            <h2>{profile.fullName}</h2>
            <p>{profile.email}</p>
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="fullName">Họ tên</label>
          <InputText id="fullName" name="fullName" value={profile.fullName} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="dob">Ngày sinh</label>
          <InputText id="dob" name="dob" value={profile.dob} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email</label>
          <InputText id="email" name="email" value={profile.email} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <InputText id="phoneNumber" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <Button label="Lưu thay đổi" icon="pi pi-save" onClick={handleSave} />
      </Card>
    </div>
  );
};

export default StudentProfile;

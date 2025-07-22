import React, { useEffect, useRef, useState } from 'react';
import { Loader, LoadingOverlay, Title, UnstyledButton } from '@mantine/core';
import { deleteRequest, getRequest, putRequest } from '../../../services/APIService';
import './AccountListPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { addToast } from '../../../utils/toastUtil';

const AccountListPage = () => {
  const emptyUser = {
    id: null,
    userName: null,
    email: null,
    phoneNumber: null,
    pid: null,
    fullname: null,
    dob: null,
    gender: null,
    address: null,
    role: null,
    lockout: null
  }
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(emptyUser);
  const [loading, setLoading] = useState(true);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shouldRefresh = queryParams.get('refresh') === 'true';
  const toast = useRef();
  const [statuses] = useState(['Inactive', 'Active', 'Undefined']);
  const [genders] = useState([
    { name: 'Female', value: 0, color: '!bg-female' },
    { name: 'Male', value: 1, color: '!bg-male' },
  ]);
  const [roles] = useState([
    { name: 'Admin', value: 'ADMIN', severity: 'danger' },
    { name: 'Academic', value: 'ACADEMIC_ADMIN', severity: 'warning' },
    { name: 'Enrollment', value: 'ENROLLMENT_STAFF', severity: 'success' },
    { name: 'Teacher', value: 'TEACHER', severity: 'info' },
    { name: 'Student', value: 'STUDENT', severity: null },
  ]);
  const getLockoutSeverity = (status) => {
    if (status == null || status == false) return 'success';
    if (status != null || status == true) return 'danger';
    return 'secondary';
  };
  const getStatusSeverity = (status) => {
    if (status == "Active") return 'success';
    if (status == "Inactive") return 'danger';
    return 'secondary';
  };
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

    if (shouldRefresh) {
      fetchUsers();
      // Sau khi fetch xong, xóa `refresh` khỏi URL nếu muốn
      const cleanUrl = location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      // Lần đầu load trang không có refresh, vẫn nên load data
      fetchUsers();
    }

    initFilters();
  }, [location.search]);


  // Fullname, Gender, Dob, Email, Phone, Role, Status, Action
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      fullname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      gender: { value: null, matchMode: FilterMatchMode.IN },
      dob: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      phoneNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      role: { value: null, matchMode: FilterMatchMode.IN },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    });
    setGlobalFilterValue('');
  };
  const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const clearFilter = () => {
    initFilters();
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderTableHeader = () => {
    return (
      <div className="flex justify-content-between gap-3">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </IconField>
        <Button onClick={() => navigate("/admin/accounts/create")}>
          <i className='pi pi-plus' />
        </Button>
      </div>
    );
  };
  const tableHeader = renderTableHeader();

  // Gender Render & Event
  const genderBodyTemplate = (rowData) => {
    const gender = rowData.gender;

    switch (gender) {
      case 0:
        return <Button className="!bg-female">Female</Button>
      case 1:
        return <Button className="!bg-male">Male</Button>
      default:
        return <Button severity='secondary'>Undefined</Button>
    }
  };
  const genderFilterTemplate = (options) => {
    return <MultiSelect value={options.value} options={genders} itemTemplate={gendersItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
  };
  const gendersItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <Tag className={option.color}>{option.name}</Tag>
      </div>
    );
  };
  // Date of Birth Render & Event
  const dobBodyTemplate = (rowData) => {
    return rowData.dob;
  };

  const dobFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
  };

  // Role Render & Event
  const roleBodyTemplate = (rowData) => {
    const role = rowData.role;

    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Button severity='danger'>Admin</Button>
      case 'ACADEMIC_ADMIN':
        return <Button severity='warning'>Academic</Button>
      case 'ENROLLMENT_STAFF':
        return <Button severity='success'>Enrollment</Button>
      case 'TEACHER':
        return <Button severity='info'>Teacher</Button>
      case 'STUDENT':
        return <Button >Student</Button>
      default:
        return <Button severity='secondary'>Undefined</Button>
    }
  };
  const roleFilterTemplate = (options) => {
    return <MultiSelect value={options.value} options={roles} itemTemplate={rolesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
  };
  const rolesItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        {option.severity ? <Tag severity={option.severity}>{option.name}</Tag> : <Tag >{option.name}</Tag>}
      </div>
    );
  };

  const userStatusOnClick = async (rowData) => {
    try {
      const enable = rowData.status === 1 ? false : true;
      const result = await putRequest(`/user/ban/${rowData.id}?enable=${enable}`);

      if (result.status === true) {
        // Cập nhật danh sách users bằng cách tạo mảng mới
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === rowData.id
              ? {
                ...user,
                status: enable ? 1 : 0,
                lockout: enable ? false : true, // hoặc dùng logic khác tùy bạn định nghĩa "bị khóa"
              }
              : user
          )
        );
        addToast(toast, "Success", "Ban/Unban user successfully", "success", 3000);
        console.log("userStatusOnClick: Successfully ban/unban user");
      } else {
        addToast(toast, "Error", `Failed to ban user: ${result.statusMessage}`, "danger", 3000);
      }
    } catch (ex) {
      console.error("userStatusOnClick: Error when ban user", ex.response.data.statusMessage);
      addToast(toast, "Error", `Failed to ban user: ${ex.response.data.statusMessage}`, "error", 3000);
      console.log(ex)
    }
  };


  // Status Render & Event
  const statusBodyTemplate = (rowData) => {
    return <Button severity={getLockoutSeverity(rowData.lockout)} onClick={() => userStatusOnClick(rowData)}>{rowData.lockout == null || rowData.lockout == false ? 'Active' : 'Inactive'}</Button>;
  };

  const statusFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
  };

  const statusItemTemplate = (option) => {
    return <Button severity={getStatusSeverity(option)}>{option}</Button>;
  };

  const deleteUser = async () => {
    try {
      const res = await deleteRequest(`/User/${user.id}`); // POST
      if (res.status && res.status == true) {
        addToast(toast, "Success", "Delete user successfully", "success", 3000);
        console.log("Success deleted!");
        return res;
      } else if (res.status && res.status == false) {
        addToast(toast, "Error", `Failed to delete user: ${res.statusMessage}`, "danger", 3000);
      }
      return null;
    } catch (ex) {
      console.error("deleteUser: Error when delete user", ex.response.data.statusMessage);
    }
  }

  const deleteUserClick = async () => {
    let _users = users.filter((val) => val.id !== user.id);
    var res = deleteUser();
    console.log(res);
    if (res) {
      console.log("Success deleted");
      setUsers(_users);
      setDeleteUserDialog(false);
      setUser(emptyUser);
    }
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };
  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteUserClick}
      />
    </React.Fragment>
  );
  const actionBody = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info-circle"
          rounded
          outlined
          className="mr-2"
          onClick={() => navigate(`/admin/accounts/${rowData.id}`)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          severity="success"
          onClick={() => navigate(`/admin/accounts/update/${rowData.id}`)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  }

  return (
    <div className="container">
      <Toast ref={toast} />
      <Title mb={20}>List of Accounts</Title>
      {
        loading
          ? <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          : <DataTable className='w-full'
            value={users}
            paginator
            showGridlines
            rows={10}
            loading={loading}
            dataKey="id"
            filters={filters}
            globalFilterFields={['fullname', 'gender', 'dob', 'email', 'phone', 'role', 'status']}
            header={tableHeader}
            emptyMessage="No accounts found."
            onFilter={(e) => setFilters(e.filters)}>
            <Column header="Fullname" field="fullname" filter sortable filterPlaceholder="Search by fullname" style={{ minWidth: '12rem' }} />
            {/* Same with Agent Example */}
            <Column header="Gender" field='gender' filterField="gender" sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }}
              body={genderBodyTemplate} filter filterElement={genderFilterTemplate} />
            <Column header="Date of Birth" filterField="dob" dataType="date" sortable style={{ minWidth: '10rem' }} body={dobBodyTemplate} filter filterElement={dobFilterTemplate} />
            {/* Same with fullname */}
            <Column header="Email" field="email" filter sortable filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
            {/* Same with fullname */}
            <Column header="Phone" field="phoneNumber" filter sortable filterPlaceholder="Search by phone" style={{ minWidth: '12rem' }} />
            {/* Same with Agent Example */}
            <Column header="Role" filterField="role" sortable showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
              body={roleBodyTemplate} filter filterElement={roleFilterTemplate} />
            <Column field="status" sortable header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
            <Column
              body={actionBody}
              exportable={false}
              style={{ minWidth: '12rem' }}
            ></Column>
          </DataTable>
      }

      <Dialog
        visible={deleteUserDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirm"
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {user.id && (
            <span>
              Are you sure you want to delete <b>{user.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>

  );
};

export default AccountListPage;

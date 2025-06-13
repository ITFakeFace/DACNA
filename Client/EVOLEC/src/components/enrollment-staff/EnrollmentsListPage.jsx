import React, { useEffect, useState } from 'react';
import { Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../services/APIService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
// import './EnrollmentsListPage.css';

const EnrollmentsListPage = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await getRequest('/enrollment');
      if (res.status) {
        setEnrollments(res.data);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      studentName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      classRoomName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      creatorName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    setGlobalFilterValue('');
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

  const statusBodyTemplate = (rowData) => {
    return rowData.status === 1
      ? <Button severity="success" label="Active" />
      : <Button severity="danger" label="Inactive" />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" severity="success"
          onClick={() => navigate(`/enrollment-staff/enrollments/update/${rowData.id}`)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger"
          onClick={() => confirmDelete(rowData)} />
      </>
    );
  };

  const confirmDelete = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteDialog(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const deleteDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => deleteEnrollment()} />
    </>
  );

  const deleteEnrollment = () => {
    const _list = enrollments.filter((val) => val.id !== selectedEnrollment.id);
    // Gọi API xóa nếu có
    setEnrollments(_list);
    setDeleteDialog(false);
    setSelectedEnrollment(null);
  };

  const renderTableHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </IconField>
      </div>
    );
  };

  return (
    <div className="container">
      <Title mb={20}>Enrollments List</Title>
      <div>
        <Button onClick={() => navigate("/enrollment-staff/enrollments/create")}>Create New Enrollment</Button>
      </div>

      <DataTable
        className="w-full"
        value={enrollments}
        paginator
        rows={10}
        showGridlines
        loading={loading}
        dataKey="id"
        filters={filters}
        globalFilterFields={['studentName', 'classRoomName', 'creatorName']}
        header={renderTableHeader()}
        emptyMessage="No enrollments found."
        onFilter={(e) => setFilters(e.filters)}
      >
        <Column header="Student" field="studentName" filter sortable style={{ minWidth: '12rem' }} />
        <Column header="Classroom" field="classRoomName" filter sortable style={{ minWidth: '12rem' }} />
        <Column header="Creator" field="creatorName" filter sortable style={{ minWidth: '10rem' }} />
        <Column header="Enroll Date" field="enrollDate" sortable style={{ minWidth: '10rem' }} />
        <Column header="Status" body={statusBodyTemplate} style={{ minWidth: '8rem' }} />
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }} />
      </DataTable>

      <Dialog
        visible={deleteDialog}
        style={{ width: '32rem' }}
        header="Confirm"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {selectedEnrollment && (
            <span>
              Are you sure you want to delete enrollment of <b>{selectedEnrollment.studentName}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default EnrollmentsListPage;

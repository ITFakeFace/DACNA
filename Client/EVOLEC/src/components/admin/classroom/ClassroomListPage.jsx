import React, { useEffect, useState } from 'react';
import { Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../services/APIService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import './ClassroomListPage.css';

const ClassroomListPage = () => {
  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const data = await getRequest("/classroom");
      if (data.Status) {
        setClassrooms(data.Data.$values);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      Id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'Course.Name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'Teacher1.Username': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'Teacher2.Username': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
    return rowData.Status === 1
      ? <Button severity="success">Active</Button>
      : <Button severity="danger">Inactive</Button>;
  };

  const actionBody = (rowData) => {
    return (
      <>
        <Button icon="pi pi-info-circle" rounded outlined className="mr-2"
          onClick={() => navigate(`/admin/classrooms/${rowData.Id}`)} />
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" severity="success"
          onClick={() => navigate(`/admin/classrooms/update/${rowData.Id}`)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger"
          onClick={() => confirmDelete(rowData)} />
      </>
    );
  };

  const confirmDelete = (classroom) => {
    setSelectedClassroom(classroom);
    setDeleteDialog(true);
  };

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const deleteDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => deleteClassroom()} />
    </>
  );

  const deleteClassroom = () => {
    const _list = classrooms.filter((val) => val.Id !== selectedClassroom.Id);
    // Gọi API xóa nếu có
    setClassrooms(_list);
    setDeleteDialog(false);
    setSelectedClassroom(null);
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
      <Title mb={20}>Class List</Title>
      <div>
        <Button onClick={() => navigate("/admin/classrooms/create")}>Create new Class</Button>
      </div>
      <DataTable
        className="w-full"
        value={classrooms}
        paginator
        rows={10}
        showGridlines
        loading={loading}
        dataKey="Id"
        filters={filters}
        globalFilterFields={['Id', 'Course.Name', 'Teacher1.Username', 'Teacher2.Username']}
        header={renderTableHeader()}
        emptyMessage="No classes found."
        onFilter={(e) => setFilters(e.filters)}
      >
        <Column header="Classroom ID" field="Id" filter sortable style={{ minWidth: '10rem' }} />
        <Column header="Course" field="Course.Name" filter sortable style={{ minWidth: '12rem' }} />
        <Column header="Teacher 1" field="Teacher1.Username" filter sortable style={{ minWidth: '10rem' }} />
        <Column header="Teacher 2" field="Teacher2.Username" filter sortable style={{ minWidth: '10rem' }} />
        <Column header="Status" body={statusBodyTemplate} style={{ minWidth: '10rem' }} />
        <Column body={actionBody} exportable={false} style={{ minWidth: '12rem' }} />
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
          {selectedClassroom && (
            <span>
              Are you sure you want to delete <b>Classroom #{selectedClassroom.Id}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ClassroomListPage;

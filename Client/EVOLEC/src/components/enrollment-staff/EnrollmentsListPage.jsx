import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title, TextInput } from '@mantine/core';
import { getRequest } from '../../services/APIService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';

const EnrollmentsListPage = () => {
  const emptyEnrollment = {
    id: null,
    studentId: null,
    classRoomId: null,
    creatorId: null,
    enrollDate: null,
    status: null,
  };

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteEnrollmentDialog, setDeleteEnrollmentDialog] = useState(false);
  const [enrollment, setEnrollment] = useState(emptyEnrollment);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
  const navigate = useNavigate(); // Hook để chuyển hướng người dùng

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await getRequest('/enrollment');
      console.log(res)
      if (res.status) {
        setEnrollments(res.data); // Lưu dữ liệu vào state
      }
      console.log("ENTROLLMENT: ")
      console.log(enrollments)
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(); // Fetch enrollments on component mount
  }, []);

  // Chức năng xóa
  const deleteEnrollmentClick = async () => {
    try {
      // Xóa bản ghi từ API
      const res = await getRequest(`/enrollments/delete/${enrollment.id}`);
      if (res.status) {
        let updatedEnrollments = enrollments.filter(
          (e) => e.id !== enrollment.id
        );
        setEnrollments(updatedEnrollments); // Cập nhật lại danh sách enrollments
        setDeleteEnrollmentDialog(false); // Đóng dialog xóa
        setEnrollment(emptyEnrollment); // Reset enrollment state
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
    }
  };

  const confirmDeleteEnrollment = (enrollment) => {
    setEnrollment(enrollment);
    setDeleteEnrollmentDialog(true);
  };

  const hideDeleteEnrollmentDialog = () => {
    setDeleteEnrollmentDialog(false);
  };

  const deleteEnrollmentDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteEnrollmentDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteEnrollmentClick}
      />
    </React.Fragment>
  );

  // const renderStatus = (status) => {
  //   return <Tag>{status === 1 ? 'Active' : 'Inactive'}</Tag>;
  // };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderTableHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button onClick={() => fetchEnrollments()} loading={loading}>
          Refresh
        </Button>
        <TextInput
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search by Keyword"
        />
      </div>
    );
  };

  const tableHeader = renderTableHeader();

  return (
    <div className="container">
      <Title mb={20}>Enrollments List</Title>
      <div>
        <Button onClick={() => navigate('/enrollment-staff/enrollments/create')}>
          Create New Enrollment
        </Button>
      </div>


        {loading ? (
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        ) : (
          <DataTable
            value={enrollments}
            paginator
            rows={10}
            loading={loading}
            header={tableHeader}
            filters={filters}
            dataKey="id"
            emptyMessage="No enrollments found."
          > 
            <Column field="id" header="ID" sortable style={{ minWidth: '10rem' }} />
            <Column field="studentId" header="Student ID" sortable style={{ minWidth: '15rem' }} />
            <Column field="classRoomId" header="Classroom ID" sortable style={{ minWidth: '15rem' }} />
            <Column field="creatorId" header="Creator ID" sortable style={{ minWidth: '15rem' }} />
            <Column field="enrollDate" header="Enroll Date" sortable style={{ minWidth: '15rem' }} />
            {/* <Column
              field="   status"
              header="Status"
              body={(rowData) => renderStatus(rowData.status)}
              style={{ minWidth: '10rem' }}
            /> */}
            <Column
              body={(rowData) => (
                <React.Fragment>
                  <Button
                    icon="pi pi-pencil"
                    className="mr-2"
                    onClick={() => navigate(`/enrollment-staff/enrollments/update/${rowData.id}`)}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="mr-2"
                    severity="danger"
                    onClick={() => confirmDeleteEnrollment(rowData)}
                  />
                </React.Fragment>
              )}
              exportable={false}
              style={{ minWidth: '12rem' }}
            />
          </DataTable>
        )}
        <Dialog
          visible={deleteEnrollmentDialog}
          style={{ width: '30rem' }}
          header="Confirm Delete"
          modal
          footer={deleteEnrollmentDialogFooter}
          onHide={hideDeleteEnrollmentDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: '2rem' }}
            />
            {enrollments.id && (
              <span>
                Are you sure you want to delete enrollment with ID{' '}
                <b>{enrollments.id}</b>?
              </span>
            )}
          </div>
        </Dialog>
    </div>
  );
};

export default EnrollmentsListPage;

import React, { useEffect, useState } from 'react';
import { LoadingOverlay, Title } from '@mantine/core';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../services/APIService';
import './CourseListPage.css';

const CourseListPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await getRequest("/course");
      if (data.status) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCourses();
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Custom render functions
  const statusBodyTemplate = (rowData) => {
    return (
      <Button
        label={rowData.status === 1 ? 'Active' : 'Inactive'}
        className={`p-button-sm ${rowData.status === 1 ? 'p-button-success' : 'p-button-danger'}`}
        disabled
      />
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          label="Details"
          className="p-button-sm"
          onClick={() => navigate(`${rowData.id}`)}
        />
        <Button
          label="Edit"
          className="p-button-sm p-button-info"
          onClick={() => navigate(`update/${rowData.id}`)}
        />
        <Button
          label="Delete"
          className="p-button-sm p-button-danger"
        />
      </div>
    );
  };

  return (
    <div className="container">
      <Title mb={20}>List of Courses</Title>
      <div className="mb-4">
        <Button onClick={() => navigate("/admin/courses/create")}>
          Create new Course
        </Button>
      </div>

      {loading ? (
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      ) : (
        <DataTable
          value={courses}
          paginator
          rows={10}
          className="p-datatable-sm w-full"
          stripedRows
          scrollable
          scrollHeight="400px"
        >
          <Column field="id" header="Course ID" sortable />
          <Column field="name" header="Course Name" sortable />
          <Column field="bandScore" header="Band Score" sortable style={{ textAlign: 'center' }} />
          <Column field="passScore" header="Pass Score" sortable style={{ textAlign: 'center' }} />
          <Column field="fullScore" header="Full Score" sortable style={{ textAlign: 'center' }} />
          <Column header="Status" body={statusBodyTemplate} style={{ textAlign: 'center' }} alignHeader="center" />
          <Column header="Actions" body={actionsBodyTemplate} style={{ minWidth: '280px', textAlign: 'center' }} alignHeader="center" />
        </DataTable>
      )}
    </div>
  );
};

export default CourseListPage;

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

import { getRequest, deleteRequest, postRequest, putRequest } from "../../../services/APIService";

const LessonDateListComponent = ({ classroomId }) => {
  const [lessonDates, setLessonDates] = useState([]);
  const [selectedLessonDates, setSelectedLessonDates] = useState([]);
  const [lessonDateDialog, setLessonDateDialog] = useState(false);
  const [deleteLessonDateDialog, setDeleteLessonDateDialog] = useState(false);
  const [deleteSelectedDialog, setDeleteSelectedDialog] = useState(false);
  const [lessonDateForm, setLessonDateForm] = useState({
    id: null,
    teacherName: '',
    lessonName: '',
    date: "",
    startTime: null,
    endTime: null,
    note: ''
  });
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchLessonDates();
  }, [classroomId]);

const fetchLessonDates = async () => {
  try {
    const res = await getRequest(`/lessondate/classroom/${classroomId}`);
    console.log(res);
    if (res.status) {
      // Giả sử res.data là mảng các lessonDate, mỗi item có teacher và lesson object
      const mappedData = res.data.map(item => ({
        id: item.id,
        teacherName: item.teacher?.username || '',  // Lấy username từ teacher object
        lessonName: item.lesson?.name || '',       // Lấy name từ lesson object
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        note: item.note || ''
      }));
      setLessonDates(mappedData);
      console.log(lessonDates);
    } else {
      toast.current.show({ severity: 'warn', summary: 'No data', detail: 'No lesson dates found' });
    }
  } catch (err) {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data' });
  }
};

  const openNew = () => {
    setLessonDateForm({
      id: null,
      teacherName: '',
      lessonName: '',
      date: null,
      startTime: null,
      endTime: null,
      note: ''
    });
    setLessonDateDialog(true);
  };

  const editLessonDate = (lessonDate) => {
    // setLessonDateForm({ ...lessonDate });
    setLessonDateForm(lessonDate );
    console.log(lessonDate);
    console.log(lessonDate.date);

    setLessonDateDialog(true);
  };

  const confirmDeleteLessonDate = (lessonDate) => {
    setLessonDateForm(lessonDate);
    setDeleteLessonDateDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteSelectedDialog(true);
  };

  // Example API call placeholders - bạn phải viết logic thực tế
  const saveLessonDate = async () => {
    try {
      let res;
      if (lessonDateForm.id) {
        res = await putRequest(`/lessondate/${lessonDateForm.id}`, lessonDateForm);
      } else {
        res = await postRequest(`/lessondate`, lessonDateForm);
      }
      if (res.status) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: `Lesson date ${lessonDateForm.id ? 'updated' : 'created'}` });
        fetchLessonDates();
        setLessonDateDialog(false);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Server error' });
    }
  };

  const deleteLessonDate = async () => {
    try {
      const res = await deleteRequest(`/lessondate/${lessonDateForm.id}`);
      if (res.status) {
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Lesson date deleted' });
        fetchLessonDates();
        setDeleteLessonDateDialog(false);
        setLessonDateForm({});
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Server error' });
    }
  };

  const deleteSelectedLessonDates = async () => {
    try {
      // Giả sử API hỗ trợ xóa nhiều, thay đổi theo API thực tế
      const promises = selectedLessonDates.map(ld => deleteRequest(`/lessondate/${ld.id}`));
      const results = await Promise.all(promises);
      if (results.every(r => r.status)) {
        toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Selected lesson dates deleted' });
        fetchLessonDates();
        setSelectedLessonDates([]);
        setDeleteSelectedDialog(false);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Some deletes failed' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Server error' });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target ? e.target.value : e.value;
    setLessonDateForm(prev => ({ ...prev, [name]: val }));
  };

  const createLessonDate = async () => {
  const lessonDateDto = {
    TeacherId: lessonDateForm.teacherName,  // Assuming teacherName contains TeacherId
    ClassRoomId: classroomId,               // Classroom ID will be passed as a prop
    LessonId: lessonDateForm.lessonName,    // Assuming lessonName contains LessonId
    Note: lessonDateForm.note,              // Optional, if you have a note in the form
    Date: lessonDateForm.date,              // Should be in Date format
    StartTime: lessonDateForm.startTime,    // Should be in Time format
    EndTime: lessonDateForm.endTime,        // Should be in Time format
  };

  try {
    const res = await postRequest('/your-api-endpoint-here', lessonDateDto);
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Lesson Date Created',
        life: 3000,
      });
      fetchLessonDates();  // Re-fetch lesson dates after creation
      setLessonDateDialog(false);  // Close the dialog
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create Lesson Date',
        life: 3000,
      });
    }
  } catch (err) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Server error occurred while creating the lesson date',
      life: 3000,
    });
  }
};
  const header = (
    <div className="flex justify-between items-center">
      <span className="text-lg font-semibold">Lesson Dates</span>
    </div>
  );

  const leftToolbar = () => {
    return (
      <div className="flex gap-2">
        <Button label="Add" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button 
          label="Delete" 
          icon="pi pi-trash" 
          severity="danger" 
          disabled={!selectedLessonDates || selectedLessonDates.length === 0} 
          onClick={confirmDeleteSelected} 
        />
      </div>
    );
  };

  const actionBody = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="mr-2" rounded outlined onClick={() => editLessonDate(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteLessonDate(rowData)} />
      </>
    );
  };

  return (
    <div className="w-full">
      <Toast ref={toast} />
      <Toolbar className="mb-4" left={leftToolbar} />
      <DataTable
        ref={dt}
        value={lessonDates}
        selection={selectedLessonDates}
        onSelectionChange={(e) => setSelectedLessonDates(e.value)}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        header={header}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="teacherName" header="Teacher" sortable />
        <Column field="lessonName" header="Lesson" sortable />
        <Column field="date" header="Date" sortable />
        <Column field="startTime" header="Start Time" />
        <Column field="endTime" header="End Time" />
        <Column field="note" header="Note" />
        <Column body={actionBody} exportable={false} style={{ textAlign: 'center', width: '8rem' }} />
      </DataTable>

      {/* Dialog for Add/Edit */}
      <Dialog
          visible={lessonDateDialog}
          style={{ width: '30rem' }}
          header="Lesson Date Details"
          modal
          onHide={() => setLessonDateDialog(false)}
        >
          <div className="field">
            <label htmlFor="teacherName" className="font-bold">Teacher Name</label>
            <InputText
              id="teacherName"
              value={lessonDateForm.teacherName || ''}
              onChange={(e) => onInputChange(e, 'teacherName')}
            />
          </div>
          <div className="field">
            <label htmlFor="lessonName" className="font-bold">Lesson Name</label>
            <InputText
              id="lessonName"
              value={lessonDateForm.lessonName || ''}
              onChange={(e) => onInputChange(e, 'lessonName')}
            />
          </div>
          <div className="field">
            <label htmlFor="date" className="font-bold">Date</label>
            <Calendar
              id="date"
              value={lessonDateForm.date ? new Date(lessonDateForm.date) : null}
              onChange={(e) => onInputChange(e, 'date')}
              dateFormat="dd-mm-yy"
              showIcon
            />
          </div>
          <div className="field">
            <label htmlFor="startTime" className="font-bold">Start Time</label>
            <InputText
              id="startTime"
              value={lessonDateForm.startTime || ''}
              onChange={(e) => onInputChange(e, 'startTime')}
              placeholder="HH:mm:ss"
            />
          </div>
          <div className="field">
            <label htmlFor="endTime" className="font-bold">End Time</label>
            <InputText
              id="endTime"
              value={lessonDateForm.endTime || ''}
              onChange={(e) => onInputChange(e, 'endTime')}
              placeholder="HH:mm:ss"
            />
          </div>
          <div className="field">
            <label htmlFor="note" className="font-bold">Note</label>
            <InputTextarea
              id="note"
              value={lessonDateForm.note || ''}
              onChange={(e) => onInputChange(e, 'note')}
              rows={4}
              cols={30}
              placeholder="Enter notes here..."
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              outlined
              onClick={() => setLessonDateDialog(false)}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={saveLessonDate}
            />
          </div>
        </Dialog>

      {/* <Dialog visible={lessonDateDialog} style={{ width: '30rem' }} header="Lesson Date Details" modal onHide={() => setLessonDateDialog(false)}>
        <div className="field">
          <label htmlFor="teacherName" className="font-bold">Teacher Name</label>
          <InputText id="teacherName" value={lessonDateForm.teacherName || ''} onChange={(e) => onInputChange(e, 'teacherName')} />
        </div>
        <div className="field">
          <label htmlFor="lessonName" className="font-bold">Lesson Name</label>
          <InputText id="lessonName" value={lessonDateForm.lessonName || ''} onChange={(e) => onInputChange(e, 'lessonName')} />
        </div>
        <div className="field">
          <label htmlFor="date" className="font-bold">Date</label>
          <Calendar id="date" value={lessonDateForm.date} onChange={(e) => onInputChange(e, 'date')} dateFormat="dd-MM-yyyy" />
        </div>
        <div className="field">
          <label htmlFor="startTime" className="font-bold">Start Time</label>
          <InputText id="startTime" value={lessonDateForm.startTime || ''} onChange={(e) => onInputChange(e, 'startTime')} placeholder="HH:mm:ss" />
        </div>
        <div className="field">
          <label htmlFor="endTime" className="font-bold">End Time</label>
          <InputText id="endTime" value={lessonDateForm.endTime || ''} onChange={(e) => onInputChange(e, 'endTime')} placeholder="HH:mm:ss" />
        </div>
        <div className="field">
          <label htmlFor="note" className="font-bold">Note</label>
          <InputText id="note" value={lessonDateForm.note || ''} onChange={(e) => onInputChange(e, 'note')} />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button label="Cancel" icon="pi pi-times" outlined onClick={() => setLessonDateDialog(false)} />
          <Button label="Save" icon="pi pi-check" onClick={saveLessonDate} />
        </div>
      </Dialog> */}

      {/* Dialog confirm delete single */}
      <Dialog visible={deleteLessonDateDialog} style={{ width: '30rem' }} header="Confirm Delete" modal
        onHide={() => setDeleteLessonDateDialog(false)} footer={
          <>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteLessonDateDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteLessonDate} />
          </>
        }>
        <p>Are you sure you want to delete <b>{lessonDateForm.lessonName}</b>?</p>
      </Dialog>

      {/* Dialog confirm delete multiple */}
      <Dialog visible={deleteSelectedDialog} style={{ width: '30rem' }} header="Confirm Delete" modal
        onHide={() => setDeleteSelectedDialog(false)} footer={
          <>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteSelectedDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedLessonDates} />
          </>
        }>
        <p>Are you sure you want to delete the selected lesson dates?</p>
      </Dialog>
    </div>
  );
};

export default LessonDateListComponent;

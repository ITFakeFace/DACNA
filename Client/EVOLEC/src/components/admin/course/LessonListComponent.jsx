import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../../services/APIService";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";

const LessonListComponent = ({ courseId, loading }) => {
  let emptyLesson = {
    id: null,
    courseId: courseId,
    name: '',
    description: '',
    contentBeforeClass: '',
    contentDuringClass: '',
    contentAfterClass: '',
    status: 1,
  };
  const status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 0 }
  ]
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [lessons, setLessons] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [deleteLessonDialog, setDeleteLessonDialog] = useState(false);
  const [deleteLessonsDialog, setDeleteLessonsDialog] = useState(false);
  const navigate = useNavigate();
  const dt = useRef(null);
  const toast = useRef(null);

  const fetchLessons = async () => {
    try {
      var res = await getRequest(`/lesson/get-by-course-id/${courseId}`);
      if (res.status) {
        const data = res.data;
        setLessons(data);
      }
      console.log("Fetch lessons");
    } catch (ex) {
      console.log("Cannot fetch data");
    }
  };
  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < lessons.length; i++) {
      if (lessons[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const updateLesson = async () => {
    const { id, ...dto } = lessonForm;
    const res = await putRequest(`/lesson/${lessonForm.id}`, dto); // PUT
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Lesson Updated',
        life: 3000,
      });
      return res;
    }
    return null;
  };

  const createLesson = async () => {
    const { id, ...dto } = lessonForm; // Bỏ id
    console.log(JSON.stringify(dto));
    const res = await postRequest(`/lesson`, dto); // POST
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Lesson Created',
        life: 3000,
      });
      console.log(JSON.stringify(res));
      return res;
    }
    return null;
  };
  const deleteLesson = async () => {
    const res = await deleteRequest(`/lesson/${lessonForm.id}`); // POST
    if (res.status) {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Lesson Deleted',
        life: 3000,
      });
      console.log(JSON.stringify(res));
      return res;
    }
    return null;
  }

  const confirmDeleteLesson = (lesson) => {
    setLessonForm(lesson);
    setDeleteLessonDialog(true);
  };
  const editLesson = (lesson) => {
    setLessonForm({ ...lesson });
    setLessonDialog(true);
  };
  const saveLesson = async () => {
    setSubmitted(true);
    // validation
    if (lessonForm.name.trim() &&
      lessonForm.description.trim() &&
      lessonForm.contentBeforeClass.trim() &&
      lessonForm.contentDuringClass.trim() &&
      lessonForm.contentAfterClass.trim()) {

      // update list
      let _lessons = [...lessons];
      let _lesson = { ...lessonForm };

      try {
        if (lessonForm.id) {
          // update
          console.log("Updating Lesson");
          const index = findIndexById(lessonForm.id);
          var res = updateLesson();
          console.log("Updated Lesson");
          if (res) {
            _lessons[index] = _lesson;
          }
        } else {
          // create
          console.log("Saving Lesson");
          var res = await createLesson();
          if (res) {
            _lessons.push(_res.data);
          }
        }
      } catch (ex) {

      }

      setLessons(_lessons);
      setLessonDialog(false);
      setLessonForm(emptyLesson);
    }
  }

  useEffect(() => {
    fetchLessons();
    console.log(JSON.stringify(lessons));
  }, []);
  const deleteLessonClick = () => {
    let _lessons = lessons.filter((val) => val.id !== lessonForm.id);
    var res = deleteLesson();
    if (res) {
      setLessons(_lessons);
      setDeleteLessonDialog(false);
      setLessonForm(emptyLesson);
    }
  };

  const deleteSelectedLessons = () => {
    let _lessons = lessons.filter((val) => !selectedLessons.includes(val));

    setLessons(_lessons);
    setDeleteLessonsDialog(false);
    setSelectedLessons(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Lessons Deleted',
      life: 3000,
    });
  };

  const openNew = () => {
    setLessonForm(emptyLesson);
    setSubmitted(false);
    setLessonDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setLessonDialog(false);
  };
  const confirmDeleteSelected = () => {

  };

  const statusBody = (rowData) => {
    switch (rowData.status) {
      case 0:
        return <Button label="Inactive" icon="pi pi-times" severity="danger" />;
      case 1:
        return <Button label="Active" icon="pi pi-check" severity="success" />;
      default:
        return <Button label="Error" icon="pi pi-exclamation-triangle" severity="secondary" />;

    }
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Lessons</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField>
    </div>
  );

  const leftToolbar = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedLessons || !selectedLessons.length} />
      </div>
    );
  }

  const rightToolbar = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="" icon="pi pi-sync" severity="primary" onClick={fetchLessons} />
      </div>
    )
  }

  const actionBody = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editLesson(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteLesson(rowData)}
        />
      </React.Fragment>
    );
  }

  // Create/Update Dialog
  const lessonDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveLesson} />
    </React.Fragment>
  );
  const onStatusChange = (e) => {
    let _lesson = { ...lessonForm };

    _lesson['status'] = e.value;
    setLessonForm(_lesson);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _lesson = { ...lessonForm };

    _lesson[`${name}`] = val;

    setLessonForm(_lesson);
  };
  const hideDeleteLessonDialog = () => {
    setDeleteLessonDialog(false);
  };
  const hideDeleteLessonsDialog = () => {
    setDeleteLessonsDialog(false);
  };

  const deleteLessonDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteLessonDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteLessonClick}
      />
    </React.Fragment>
  );
  const deleteLessonsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteLessonsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedLessons}
      />
    </React.Fragment>
  );

  return (
    <div className="w-full">
      <Toast ref={toast} />
      <Toolbar className="mb-4" left={leftToolbar} right={rightToolbar}></Toolbar>

      <DataTable ref={dt} value={lessons} selection={selectedLessons} onSelectionChange={(e) => setSelectedLessons(e.value)}
        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} lessons" globalFilter={globalFilter} header={header}>
        <Column selectionMode="single" exportable={false}></Column>
        <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="description" header="Description" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="status" header="Status" body={statusBody}></Column>
        <Column
          body={actionBody}
          exportable={false}
          style={{ minWidth: '12rem' }}
        ></Column>
      </DataTable>

      <Dialog
        visible={lessonDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Lesson Details"
        modal
        className="p-fluid"
        footer={lessonDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <InputText
            id="name"
            value={lessonForm.name}
            onChange={(e) => onInputChange(e, 'name')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !lessonForm.name })}
          />
          {submitted && !lessonForm.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputTextarea
            id="description"
            value={lessonForm.description}
            onChange={(e) => onInputChange(e, 'description')}
            required
            rows={3}
            cols={20}
          />
          {submitted && !lessonForm.description && (
            <small className="p-error">Lesson Description is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="contentBeforeClass" className="font-bold">
            Content Before Class
          </label>
          <InputTextarea
            id="contentBeforeClass"
            value={lessonForm.contentBeforeClass}
            onChange={(e) => onInputChange(e, 'contentBeforeClass')}
            required
            rows={3}
            cols={20}
          />
          {submitted && !lessonForm.contentBeforeClass && (
            <small className="p-error">Content Before Class is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="contentDuringClass" className="font-bold">
            Content During Class
          </label>
          <InputTextarea
            id="contentDuringClass"
            value={lessonForm.contentDuringClass}
            onChange={(e) => onInputChange(e, 'contentDuringClass')}
            required
            rows={3}
            cols={20}
          />
          {submitted && !lessonForm.contentDuringClass && (
            <small className="p-error">Content During Class is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="contentAfterClass" className="font-bold">
            Content After Class
          </label>
          <InputTextarea
            id="contentAfterClass"
            value={lessonForm.contentAfterClass}
            onChange={(e) => onInputChange(e, 'contentAfterClass')}
            required
            rows={3}
            cols={20}
          />
          {submitted && !lessonForm.contentAfterClass && (
            <small className="p-error">Content After Class is required.</small>
          )}
        </div>


        <div className="field">
          <label className="mb-3 font-bold">Status</label>
          <div className="card flex justify-content-center">
            <Dropdown value={lessonForm.status} onChange={(e) => onStatusChange(e)} options={status} optionLabel="name"
              placeholder="Select a City" className="w-full" />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteLessonDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirm"
        modal
        footer={deleteLessonDialogFooter}
        onHide={hideDeleteLessonDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {lessonForm && (
            <span>
              Are you sure you want to delete <b>{lessonForm.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteLessonsDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Confirm"
        modal
        footer={deleteLessonsDialogFooter}
        onHide={hideDeleteLessonsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: '2rem' }}
          />
          {lessonForm && (
            <span>Are you sure you want to delete the selected lessons?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default LessonListComponent;

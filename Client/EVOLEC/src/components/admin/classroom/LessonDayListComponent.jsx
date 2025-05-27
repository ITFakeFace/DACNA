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
import { Dropdown } from "primereact/dropdown";

import { getRequest, deleteRequest, postRequest, putRequest } from "../../../services/APIService";

const LessonDateListComponent = ({ classroomId }) => {
  const [lessonDates, setLessonDates] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedLessonDates, setSelectedLessonDates] = useState([]);
  const [lessonDateDialog, setLessonDateDialog] = useState(false);
  const [deleteLessonDateDialog, setDeleteLessonDateDialog] = useState(false);
  const [deleteSelectedDialog, setDeleteSelectedDialog] = useState(false);
   const [lessons, setLessons] = useState([]); // Mới thêm để lưu danh sách bài học
  const [lessonDateForm, setLessonDateForm] = useState({
    id: null,
    teacherName: "", // lưu id teacher
    teacherId:"",
    lessonName: "",   // Thêm trường này để lưu tên bài học
    lessonId: "",
    date: null, 
    startTime: "",
    endTime: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    fetchLessonDates();
    fetchTeachers();
       fetchLessons();
  }, [classroomId]);

    const fetchLessons = async () => {
    try {
      const res = await getRequest("/lesson"); // Chỉnh API lấy danh sách bài học
      // console.log(res)
      if (res.status) {
        setLessons(res.data); // Lưu dữ liệu bài học vào state
      } else {
        toast.current.show({
          severity: "warn",
          summary: "No lessons found",
          detail: "No lessons found",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch lessons",
      });
    }
  };

  const fetchLessonDates = async () => {
    try {
      const res = await getRequest(`/lessondate/classroom/${classroomId}`);
      if (res.status) {
        const mappedData = res.data.map((item) => ({
          id: item.id,
          teacherName: item.teacher?.username || "",
          teacherId: item.teacher?.id,
          lessonName: item.lesson?.name || "",
          lessonId:item.lesson?.id || "",
          date: item.date ? new Date(item.date) : null,
          startTime: item.startTime || "",
          endTime: item.endTime || "",
          note: item.note || "",
        }));
        // console.log(res)
        setLessonDates(mappedData);
        // console.log("map Data:")
        // console.log(mappedData)
      } else {
        toast.current.show({
          severity: "warn",
          summary: "No data",
          detail: "No lesson dates found",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch data",
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await getRequest("/user/teachers");
      if (res.status) {
        setTeachers(res.data);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "No teachers",
          detail: "No teachers found",
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch teachers",
      });
    }
  };

  const openNew = () => {
    setLessonDateForm({
      id: null,
      teacherName: "",
      teacherId:"",
      lessonId:"",
      lessonName: "",
      date: null,
      startTime: "",
      endTime: "",
      note: "",
    });
    setErrors({});
    setLessonDateDialog(true);
  };

  const editLessonDate = (lessonDate) => {
    setLessonDateForm({ ...lessonDate });
    console.log(lessonDateForm)
    setErrors({});
    setLessonDateDialog(true);
  };

  const confirmDeleteLessonDate = (lessonDate) => {
    setLessonDateForm(lessonDate);
    setDeleteLessonDateDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteSelectedDialog(true);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!lessonDateForm.teacherId) newErrors.teacherName = "Teacher is required";
    if (!lessonDateForm.lessonId) newErrors.lessonName = "Lesson Name is required";

    if (!lessonDateForm.date) {
      newErrors.date = "Date is required";
    } 

    if (!lessonDateForm.startTime) newErrors.startTime = "Start Time is required";
    if (!lessonDateForm.endTime) newErrors.endTime = "End Time is required";

    // Check time format HH:mm:ss
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (
      lessonDateForm.startTime &&
      !timeRegex.test(lessonDateForm.startTime)
    ) newErrors.startTime = "Invalid time format (HH:mm:ss)";
    if (
      lessonDateForm.endTime &&
      !timeRegex.test(lessonDateForm.endTime)
    ) newErrors.endTime = "Invalid time format (HH:mm:ss)";

    // Check startTime < endTime
    if (
      lessonDateForm.startTime &&
      lessonDateForm.endTime &&
      timeRegex.test(lessonDateForm.startTime) &&
      timeRegex.test(lessonDateForm.endTime)
    ) {
      const [sh, sm, ss] = lessonDateForm.startTime.split(":").map(Number);
      const [eh, em, es] = lessonDateForm.endTime.split(":").map(Number);
      const startInSec = sh * 3600 + sm * 60 + ss;
      const endInSec = eh * 3600 + em * 60 + es;
      if (startInSec >= endInSec) {
        newErrors.endTime = "End Time must be after Start Time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveLessonDate = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please correct the errors in the form",
      });
      return;
    }

    try {
      const payload = {
        teacherId: lessonDateForm.teacherId,
        teacherName:lessonDateForm.teacherName,
        lessonName:lessonDateForm.lessonName,
        lessonId: lessonDateForm.lessonId,
        classRoomId: classroomId,
        date: lessonDateForm.date
          ? lessonDateForm.date.toISOString().split("T")[0]
          : null,
        startTime: lessonDateForm.startTime,
        endTime: lessonDateForm.endTime,
        note: lessonDateForm.note,
      };
      // console.log(payload)
      let res;
      if (lessonDateForm.id) {
      // console.log("PayLoad: ") 
      // console.log(payload) 
      // console.log("lesson: ")
      // console.log(lessonDateForm)
      // console.log("Lesson Date:")
      // console.log(lessonDates)
        res = await putRequest(`/lessondate/${lessonDateForm.id}`, payload);
        
      } else {
        res = await postRequest(`/lessondate`, payload);
      }
      // console.log(res)
      if (res.status) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: lessonDateForm.id
            ? "Lesson date updated"
            : "Lesson date created",
          life: 3000,
        });
        fetchLessonDates();
        setLessonDateDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Operation failed",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Server error",
        life: 3000,
      });
    }
  };

  const deleteLessonDate = async () => {
    try {
      const res = await deleteRequest(`/lessondate/${lessonDateForm.id}`);
      if (res.status) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "Lesson date deleted",
          life: 3000,
        });
        fetchLessonDates();
        setDeleteLessonDateDialog(false);
        setLessonDateForm({
          id: null,
          teacherName: "",
          lessonName: "",
          date: null,
          startTime: "",
          endTime: "",
          note: "",
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Delete failed",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Server error",
        life: 3000,
      });
    }
  };

  const deleteSelectedLessonDates = async () => {
    try {
      const promises = selectedLessonDates.map((ld) =>
        deleteRequest(`/lessondate/${ld.id}`)
      );
      const results = await Promise.all(promises);

      if (results.every((r) => r.status)) {
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "Selected lesson dates deleted",
          life: 3000,
        });
        fetchLessonDates();
        setSelectedLessonDates([]);
        setDeleteSelectedDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Some deletes failed",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Server error",
        life: 3000,
      });
    }
  };

  const onInputChange = (e, name) => {
    const val = e.target ? e.target.value : e.value;
    setLessonDateForm((prev) => ({ ...prev, [name]: val }));
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="text-lg font-semibold">Lesson Dates</span>
    </div>
  );

  const leftToolbar = () => (
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

  const actionBody = (rowData) => (
    <>
      <Button
        icon="pi pi-pencil"
        className="mr-2"
        rounded
        outlined
        onClick={() => editLessonDate(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => confirmDeleteLessonDate(rowData)}
      />
    </>
  );

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
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="teacherName" header="Teacher" sortable />
        <Column field="lessonName" header="Lesson" sortable />
        <Column
          field="date"
          header="Date"
          sortable
          body={(rowData) =>
            rowData.date ? rowData.date.toLocaleDateString() : ""
          }
        />
        <Column field="startTime" header="Start Time" />
        <Column field="endTime" header="End Time" />
        <Column field="note" header="Note" />
        <Column
          body={actionBody}
          exportable={false}
          style={{ textAlign: "center", width: "8rem" }}
        />
      </DataTable>


       {/* from them/sua */}
      <Dialog
        visible={lessonDateDialog}
        style={{ width: "40rem" }}
        header="Lesson Date Details"
        modal
        onHide={() => setLessonDateDialog(false)}
        className="p-fluid"
      >
          <div className="p-field">
            <label htmlFor="teacherId">Teacher</label>
            <Dropdown
              id="teacherId"
              options={teachers}
              optionLabel="fullname" // Tên giáo viên hiển thị trong dropdown
              optionValue="id" // Giá trị ID của giáo viên, được lưu trữ
              value={lessonDateForm.teacherId} // Đảm bảo giá trị teacherId được lưu và chọn đúng trong dropdown
              onChange={(e) => onInputChange(e, "teacherId")} // Cập nhật teacherId khi người dùng chọn
              placeholder="Select a Teacher"
              filter
              filterPlaceholder="Search teacher"
              showClear
              className={errors.teacherName ? "p-invalid" : ""} // Hiển thị lỗi nếu có
            />
            {errors.teacherName && (
              <small className="p-error">{errors.teacherName}</small> // Hiển thị lỗi nếu có
            )}
          </div>

          <div className="p-field">
            <label htmlFor="lessonId">Lesson Name</label>
           <Dropdown
              id="lessonId"
              options={lessons}
              optionLabel="name" // Hiển thị tên bài học
              optionValue="id" // Lưu ID của bài học
              value={lessonDateForm.lessonId} // Lưu ID đã chọn (thay vì tên)
              onChange={(e) => onInputChange(e, "lessonId")} // Lưu ID khi chọn bài học
              placeholder="Select a Lesson"
              filter
              showClear
              className={errors.lessonName ? "p-invalid" : ""}
            />
            {errors.lessonName && <small className="p-error">{errors.lessonName}</small>}
        </div>


        <div className="p-field">
          <label htmlFor="date">Date</label>
          <Calendar
            id="date"
            value={lessonDateForm.date}
            onChange={(e) => onInputChange(e, "date")}
            dateFormat="dd-mm-yy"
            showIcon
          />
          {errors.date && <small className="p-error">{errors.date}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="startTime">Start Time</label>
          <InputText
            id="startTime"
            value={lessonDateForm.startTime || ""}
            onChange={(e) => onInputChange(e, "startTime")}
            placeholder="HH:mm:ss"
            className={errors.startTime ? "p-invalid" : ""}
          />
          {errors.startTime && (
            <small className="p-error">{errors.startTime}</small>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="endTime">End Time</label>
          <InputText
            id="endTime"
            value={lessonDateForm.endTime || ""}
            onChange={(e) => onInputChange(e, "endTime")}
            placeholder="HH:mm:ss"
            className={errors.endTime ? "p-invalid" : ""}
          />
          {errors.endTime && <small className="p-error">{errors.endTime}</small>}
        </div>

        <div className="p-field">
          <label htmlFor="note">Note</label>
          <InputTextarea
            id="note"
            value={lessonDateForm.note || ""}
            onChange={(e) => onInputChange(e, "note")}
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
          <Button label="Save" icon="pi pi-check" onClick={saveLessonDate} />
        </div>
      </Dialog>

      <Dialog
        visible={deleteLessonDateDialog}
        style={{ width: "30rem" }}
        header="Confirm Delete"
        modal
        onHide={() => setDeleteLessonDateDialog(false)}
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              outlined
              onClick={() => setDeleteLessonDateDialog(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={deleteLessonDate}
            />
          </>
        }
      >
        <p>
          Are you sure you want to delete <b>{lessonDateForm.lessonName}</b>?
        </p>
      </Dialog>

      <Dialog
        visible={deleteSelectedDialog}
        style={{ width: "30rem" }}
        header="Confirm Delete"
        modal
        onHide={() => setDeleteSelectedDialog(false)}
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              outlined
              onClick={() => setDeleteSelectedDialog(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              severity="danger"
              onClick={deleteSelectedLessonDates}
            />
          </>
        }
      >
        <p>Are you sure you want to delete the selected lesson dates?</p>
      </Dialog>
    </div>
  );
};

export default LessonDateListComponent;

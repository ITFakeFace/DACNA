import { Loader, LoadingOverlay } from "@mantine/core";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { getRequest } from "../../services/APIService";
import { DataTable } from "primereact/datatable";
import { formatDate } from "../../utils/dateUtil";

const StudentTable = ({ title, classroomId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const fetchStudents = async () => {
    try {
      console.log(`/classroom/get-students/${classroomId}`)
      var result = await getRequest(`/classroom/get-students/${classroomId}`);
      if (result.status && result.status == true) {
        setStudents(result.data);
        console.log("FetchStudents: Fetch students successfully");
      }
      console.log(students);
    } catch (ex) {
      console.log("FetchStudents: Cannot fetch students " + ex);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, [])

  const genderBodyTemplate = (rowData) => {
    const gender = rowData.gender;

    switch (gender) {
      case 0:
        return <Tag className="!bg-female">Female</Tag>
      case 1:
        return <Tag className="!bg-male">Male</Tag>
      default:
        return <Tag severity='secondary'>Undefined</Tag>
    }
  };

  // Date of Birth Render & Event
  const dobBodyTemplate = (rowData) => {
    return formatDate(rowData.dob);
  };

  const tableHeader = () => {
    return (<></>);
  }

  return (
    <div className="mt-10">
      <div className="w-full font-semibold text-4xl text-center mb-5">{title ?? "Student List"}</div>
      {
        loading
          ? <Loader />
          : <DataTable className='w-full'
            value={students}
            paginator
            showGridlines
            rows={10}
            loading={loading}
            dataKey="id"
            emptyMessage="No students found."
          >
            <Column header="Fullname" field="fullname" sortable style={{ minWidth: '15rem' }} />
            {/* Same with Agent Example */}
            <Column header="Gender" field='gender' sortable body={genderBodyTemplate} style={{ minWidth: '10rem' }} />
            <Column header="Date of Birth" field="dob" dataType="date" sortable style={{ minWidth: '10rem' }} body={dobBodyTemplate} />
            {/* Same with fullname */}
            <Column header="Email" field="email" sortable style={{ minWidth: '12rem' }} />
            {/* Same with fullname */}
            <Column header="Phone" field="phoneNumber" sortable style={{ minWidth: '12rem' }} />
          </DataTable>
      }
    </div>
  );
}

export default StudentTable;
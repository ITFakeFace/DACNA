import { useEffect, useState } from "react";
import { getRequest } from "../../services/APIService";
import { DataTable } from "primereact/datatable";
import { Loader } from "@mantine/core";
import { Column } from "primereact/column";
import { getShiftDescription } from "../../utils/shiftUtil";

const TeachClassTable = ({ teacherId }) => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      let result = await getRequest(`/user/teach-classrooms/${teacherId}`);
      if (result.status && result.status == true) {
        setClasses(result.data);
        console.log("FetchClasses: Fetch classes successfully");
      }
      setLoading(false);
    } catch (ex) {
      console.log("FetchClasses: Cannot fetch classes " + ex);
    }
  }

  useEffect(() => {
    fetchClasses();
    console.log(classes);
  }, []);

  return (
    <div className="mt-10">
      {
        loading
          ? <Loader />
          : <DataTable className='w-full'
            value={classes}
            paginator
            showGridlines
            rows={10}
            loading={loading}
            dataKey="id"
            emptyMessage="No classes found."
          >
            <Column field="id" header="ID" sortable></Column>
            <Column field="course.name" header="Course" sortable></Column>
            <Column field="shift" body={(rowData) => getShiftDescription(rowData.shift)} header="Shift" sortable></Column>
            <Column field="startDate" header="Start" sortable></Column>
            <Column field="endDate" header="End" sortable></Column>
          </DataTable>
      }
    </div>
  );
};

export default TeachClassTable;
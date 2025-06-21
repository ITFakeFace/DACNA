import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../services/APIService';

export default function AffectedClassTable({ offDateId }) {
  const [affectedClasses, setAffectedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const navigate = useNavigate();

  const fetchAffectedClasses = async () => {
    try {
      const res = await getRequest(`/lessonoffdate/affected/${offDateId}`);
      if (res.status) {
        setAffectedClasses(res.data);
      } else {
        setAffectedClasses([]);
      }
    } catch (error) {
      console.error("Error fetching affected classes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchAffectedClasses();
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [offDateId]);

  // 🔍 Xử lý khi gõ vào ô search
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  // ❌ Xóa nội dung ô search
  const clearFilter = () => {
    setGlobalFilterValue('');
  };

  // ✅ Header có CSS đẹp
  const header = (
    <div className="flex flex-wrap gap-3 items-center justify-end mb-4">
      <button
        type="button"
        onClick={clearFilter}
        className="flex items-center gap-2 border border-violet-500 text-violet-600 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-violet-50 transition"
      >
        <i className="pi pi-filter-slash" />
        Clear
      </button>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <i className="pi pi-search" />
        </span>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search ..."
          className="!p-0 !pl-10 !pr-4 !py-2 border border-violet-500 rounded-md focus:ring-violet-500 focus:border-violet-500 text-sm w-72"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Affected Classes</h2>

      {loading ? (
        <div className="text-center py-8 text-gray-500 animate-pulse">
          Loading affected classes...
        </div>
      ) : (
        <DataTable
          value={affectedClasses}
          paginator
          rows={5}
          className="rounded overflow-hidden text-sm border border-gray-300"
          tableClassName="min-w-full border-separate border-spacing-0"
          emptyMessage="No affected classes found."
          globalFilter={globalFilterValue}
          header={header}
          sortMode="multiple"
        >
          <Column
            field="classRoomName"
            header="Class Name"
            sortable
            body={(rowData) => (
              <span
                onClick={() => navigate(`/admin/classrooms/${rowData.classRoomId}`)}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                {rowData.classRoomName}
              </span>
            )}
            className="border-r border-gray-300"
          />
          <Column field="lesson" header="Lesson" sortable className="border-r border-gray-300" />
          <Column field="teacher" header="Teacher" sortable className="border-r border-gray-300" />
          <Column field="date" header="Date" sortable className="border-r border-gray-300" />
          <Column field="startTime" header="Start Time" sortable className="border-r border-gray-300" />
          <Column field="endTime" header="End Time" sortable className="border-r border-gray-300" />
          <Column field="roomName" header="Room" sortable />
        </DataTable>
      )}
    </div>
  );
}

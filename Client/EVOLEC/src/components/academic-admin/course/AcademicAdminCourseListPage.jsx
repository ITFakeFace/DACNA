import { useEffect, useState } from "react";
import { getRequest } from "../../../services/APIService";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay, Title } from "@mantine/core";
import { Button } from "primereact/button";
import DataTable from "react-data-table-component";

const AcademicAdminCourseListPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await getRequest("/course"); // Gọi API lấy danh sách khóa học
      if (data.status) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  // Fetch courses data when component mounts
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


  const columns = [
    { name: 'Course Name', selector: row => row.name, sortable: true },
    { name: 'Band Score', selector: row => row.bandScore, sortable: true, center: true },
    { name: 'Pass Score', selector: row => row.passScore, sortable: true, center: true },
    { name: 'Full Score', selector: row => row.fullScore, sortable: true, center: true },
    {
      name: 'Status',
      selector: row => {
        return row.status === 1
          ? <Button color='green'>Active</Button>
          : <Button color='red'>Inactive</Button>;
      },
      sortable: true,
      center: true,
    },
    {
      name: '',
      selector: (row) => {
        return (
          <div className="flex gap-2 justify-center">
            <Button size="xs"
              onClick={() => navigate(`${row.id}`)}
            >
              Details
            </Button>
            <Button size="xs" className="!bg-cyan-500"
              onClick={() => navigate(`update/${row.id}`)}
            >
              Edit
            </Button>
            <Button size="xs" color="red"
            >
              Delete
            </Button>
          </div>
        );
      },
      sortable: false,
      center: true,
      minWidth: '280px',
    },
  ];

  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        justifyContent: 'center',
      },
    },
  };

  return (
    <div className="container">
      <Title mb={20}>List of Courses</Title>
      <div>
        <Button onClick={() => navigate("/academic-admin/courses/create")}>Create new Course</Button>
      </div>
      {loading ? <LoadingOverlay visible={loading} /> :
        <DataTable
          className='w-full data-table'
          columns={columns}   // Cập nhật lại cách khai báo cột
          data={courses}      // Dữ liệu sẽ là `courses`
          pagination           // Bật phân trang
          highlightOnHover     // Hiển thị hiệu ứng hover
          responsive           // Đảm bảo responsive cho màn hình nhỏ
          fixedHeader          // Đảm bảo header cố định
          customStyles={tableCustomStyles}
        />}

    </div>
  );
};

export default AcademicAdminCourseListPage;
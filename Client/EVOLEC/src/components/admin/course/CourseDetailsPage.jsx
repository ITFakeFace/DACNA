import { Button, Group, LoadingOverlay, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getRequest } from "../../../services/APIService";
import { useNavigate, useParams } from "react-router-dom";
import { formatToFullTime } from "../../../services/timeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import LessonListComponent from "./LessonListComponent";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [course, setCourse] = useState({
    name: '',
    description: '',
    fullScore: 0,
    passScore: 0,
    bandScore: 0,
    createdAt: '',
    updatedAt: '',
    creator: {
      username: "",
      email: "",
      fullname: "",
      pid: "",
      phone: "",
      gender: -1
    }, // Có thể lấy từ context hoặc localStorage nếu cần
    status: '1'
  });

  const lessonColumns = [
    { name: 'Tên tiết', selector: row => row.name, sortable: true },
    { name: 'Mô tả`', selector: row => row.bandScore, sortable: true, center: true },
    {
      name: 'Trạng thái',
      selector: row => {
        return row.status === 1
          ? <Button color='green'>Hoạt động</Button>
          : <Button color='red'>Không hoạt động</Button>;
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
              onClick={() => navigate(`/admin/lessons/${row.id}`)}
            >
              Chi tiết
            </Button>
            <Button size="xs" className="!bg-cyan-500"
              onClick={() => navigate(`/admin/lessons/update/${row.id}`)}
            >
              Cập nhật
            </Button>
            <Button size="xs" color="red"
              onClick={() => handleDelete(row.id)}
            >
              Xóa
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
        padding: '0 8px',
        justifyContent: 'center',
      },
    },
  };
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getRequest(`/course/with-creator/${id}`);
        if (res.status) {
          const data = res.data;
          setCourse({
            name: data.name,
            description: data.description,
            fullScore: data.fullScore,
            passScore: data.passScore,
            bandScore: data.bandScore,
            creator: data.creator,
            createdAt: formatToFullTime(data.createdAt),
            updatedAt: formatToFullTime(data.updatedAt),
            status: data.status.toString()
          });
        } else {
          alert('Không tìm thấy khóa học!');
          navigate('/admin/courses');
        }
      } catch (error) {
        console.error('Lỗi khi tải khóa học:', error);
      }
    };

    try {
      setLoading(true);
      setLessonLoading(true);
      fetchCourse();
      setLoading(false);
      setLessonLoading(false);
    } catch (error) {

    }
  }, [])





  if (loading)
    return <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
  return (
    <div className="container m-3">
      <div className="row">
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => navigate('/admin/courses')}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className='font-bold text-2xl ml-3'>
            Quay lại
          </span>
        </Button>

      </div>
      <div className="row">
        <Title size='xl' mt={30}>Thông tin khóa học</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Username :</div>
            <div className="w-3/4">{course.name}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Descirption :</div>
            <div className="w-3/4 text-wrap">{course.description}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Band điểm :</div>
            <div className="w-3/4">{course.bandScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Điểm tối đa :</div>
            <div className="w-3/4">{course.fullScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Điểm vượt qua :</div>
            <div className="w-3/4">{course.passScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Tạo lúc :</div>
            <div className="w-3/4">{course.createdAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Cập nhật lúc :</div>
            <div className="w-3/4">{course.updatedAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Tình trạng :</div>
            <div className="w-3/4">{course.passScore}</div>
          </div>
        </Group>
      </div>
      <div className="row">
        <Title size='xl' mt={50}>Thông tin người tạo</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Họ và tên :</div>
            <div className="w-3/4">{course.creator.fullname ?? "(Không xác định)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Email :</div>
            <div className="w-3/4">{course.creator.email ?? "(Không xác định)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Số điện thoại :</div>
            <div className="w-3/4">{course.creator.phone ?? "(Không xác định)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Giới tính :</div>
            <div className="w-3/4">
              {course.creator.gender === 1 ? <span className="text-male">Nam </span> : <span className="text-female">Nữ </span>}
            </div>
          </div>
        </Group>
      </div>
      <div className="row">
        <Title size='xl' mt={50}>Chi tiết khóa học</Title>
        <Group m={30}>
          <Button color="blue">Tạo tiết học</Button>
        </Group>
        <Group>

          {lessonLoading ? (
            <LoadingOverlay visible={lessonLoading} overlayProps={{ blur: 2 }} />
          ) : (
            <LessonListComponent courseId={id} loading={lessonLoading} />
          )}
        </Group>
      </div>
    </div>
  )
}

export default CourseDetailsPage;
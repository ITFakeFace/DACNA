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
          alert('Cannot find course!');
          navigate('/admin/courses');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
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
            Back
          </span>
        </Button>

      </div>
      <div className="row">
        <Title size='xl' mt={30}>Course's Inforation</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Course Name :</div>
            <div className="w-3/4">{course.name}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Course Descirption :</div>
            <div className="w-3/4 text-wrap">{course.description}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Band Score :</div>
            <div className="w-3/4">{course.bandScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Full Score :</div>
            <div className="w-3/4">{course.fullScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Pass Score :</div>
            <div className="w-3/4">{course.passScore}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Created At :</div>
            <div className="w-3/4">{course.createdAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Updated At :</div>
            <div className="w-3/4">{course.updatedAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Status :</div>
            <div className="w-3/4">{course.status == 1
              ? <Button color='green'>Active</Button>
              : <Button color='red'>Inactive</Button>}
            </div>
          </div>
        </Group>
      </div>
      <div className="row">
        <Title size='xl' mt={50}>Creator's Information</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Fullname :</div>
            <div className="w-3/4">{course.creator.fullname ?? "(Undefined)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Email :</div>
            <div className="w-3/4">{course.creator.email ?? "(Undefined)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Phone Number :</div>
            <div className="w-3/4">{course.creator.phone ?? "(Undefined)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Gender :</div>
            <div className="w-3/4">
              {course.creator.gender === 1
                ? <span className="text-male">Male </span>
                : <span className="text-female">Female </span>}
            </div>
          </div>
        </Group>
      </div>
      <div className="row">
        <Title size='xl' mt={50}>Course's Details</Title>
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
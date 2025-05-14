import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title, Group } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest } from '../../../services/APIService'; // Giả sử có các hàm API
import { formatToFullTime } from '../../../services/timeService'; // Hàm định dạng thời gian
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from 'primereact/calendar'; // PrimeReact Calendar component

const ClassroomDetailsPage = () => {
  const { id } = useParams(); // Nhận id lớp học từ URL
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null); // State lưu thông tin lớp học
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await getRequest(`/classroom/${id}`); // Lấy dữ liệu lớp học từ API
        if (res.status) {
          const data = res.data;
          setClassroom({
            id: data.id,
            teacher1: data.teacher1Id,
            teacher2: data.teacher2Id,
            courseId: data.courseId,
            creator: data.creatorId,
            startDate: formatToFullTime(data.startDate),
            endDate: formatToFullTime(data.endDate),
            status: data.status,
            shift: data.shift,
            createdAt: formatToFullTime(data.createdAt),
            updatedAt: formatToFullTime(data.updatedAt),
          });
        } else {
          alert('Cannot find classroom!');
          navigate('/admin/classrooms');
        }
      } catch (error) {
        console.error('Error fetching classroom:', error);
      }
    };

    fetchClassroom();
  }, [id, navigate]);

  if (loading) return <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />;

  return (
    <div className="container m-3">
      <div className="row">
        <Button
          className='!bg-transparent !text-black'
          size='xl'
          p='xs'
          onClick={() => navigate('/admin/classrooms')}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className='font-bold text-2xl ml-3'>
            Back
          </span>
        </Button>
      </div>

      <div className="row">
        <Title size='xl' mt={30}>Classroom Information</Title>
        {/* <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Teacher 1:</div>
            <div className="w-3/4">{classroom.teacher1}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Teacher 2:</div>
            <div className="w-3/4">{classroom.teacher2}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Course ID:</div>
            <div className="w-3/4">{classroom.courseId}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Start Date:</div>
            <div className="w-3/4">{classroom.startDate}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">End Date:</div>
            <div className="w-3/4">{classroom.endDate}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Status:</div>
            <div className="w-3/4">
              {classroom.status === 1 ? <Button color='green'>Active</Button> : <Button color='red'>Inactive</Button>}
            </div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Shift:</div>
            <div className="w-3/4">{classroom.shift}</div>
          </div>
        </Group> */}
      </div>

      <div className="row">
        <Title size='xl' mt={50}>Creator's Information</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Creator ID:</div>
            <div className="w-3/4">{classroom.creator}</div>
          </div>
        </Group>
      </div>

      <div className="row">
        <Title size='xl' mt={50}>Classroom's Details</Title>
        {/* Nếu bạn có một component để hiển thị thêm chi tiết lớp học, bạn có thể thêm vào đây */}
        <LessonListComponent courseId={classroom.courseId} />
      </div>
    </div>
  );
};

export default ClassroomDetailsPage;

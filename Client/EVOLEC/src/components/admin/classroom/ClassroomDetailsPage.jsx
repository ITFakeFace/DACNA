import React, { useEffect, useState } from 'react';
import { Button, LoadingOverlay, Title, Group } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest } from '../../../services/APIService';
import { formatToFullTime } from '../../../services/timeService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LessonDayListComponent from './LessonDayListComponent';
const ClassroomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(true);

  const [classroom, setClassroom] = useState({
  id: '',
  course: { id: '', name: '' },
  teacher1: { id: '', fullname: '', email: '', phone: '' },
  teacher2: { id: '', fullname: '', email: '', phone: '' },
  creator: { id: '', fullname: '', email: '', phone: '' },
  startDate: '',
  endDate: '',
  status: '',
  shift: '',
  createdAt: '',
  updatedAt: ''
});



useEffect(() => {
  const fetchClassroom = async () => {
    try {
      setLoading(true);
      setLessonLoading(true); // 👈 bắt đầu loading bài học
      const res = await getRequest(`/classroom/${id}`);
      if (res.status) {
        const data = res.data;
        console.log(data);
        setClassroom({
          id: data.id,
          course: data.course ?? { id: '', name: '(Undefined)' },
          teacher1: data.teacher1 ?? { id: '', fullname: '(Undefined)', email: '', phone: '' },
          teacher2: data.teacher2 ?? { id: '', fullname: '(Undefined)', email: '', phone: '' },
          creator: data.creator ?? { id: '', fullname: '(Undefined)', email: '', phone: '' },
          startDate: formatToFullTime(data.startDate),
          endDate: formatToFullTime(data.endDate),
          status: data.status.toString(),
          shift: data.shift,
          createdAt: formatToFullTime(data.createdAt),
          updatedAt: formatToFullTime(data.updatedAt),
        });
      } else {
        alert('Cannot find classroom!');
      }
    } catch (error) {
      console.error('Error fetching classroom:', error);
    } finally {
      setLoading(false);
      setLessonLoading(false); // 👈 kết thúc loading bài học
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
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Classroom ID :</div>
            <div className="w-3/4">{id}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Course Name :</div>
            <div className="w-3/4">{classroom.course.name}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Shift :</div>
            <div className="w-3/4">{classroom.shift}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Start Date :</div>
            <div className="w-3/4">{classroom.startDate}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">End Date :</div>
            <div className="w-3/4">{classroom.endDate}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Created At :</div>
            <div className="w-3/4">{classroom.createdAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Updated At :</div>
            <div className="w-3/4">{classroom.updatedAt}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Status :</div>
            <div className="w-3/4">
              {classroom.status === '1' ? (
                <Button color='green'>Active</Button>
              ) : (
                <Button color='red'>Inactive</Button>
              )}
            </div>
          </div>
        </Group>
      </div>

      <div className="row">
        <Title size='xl' mt={50}>Teacher Information</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Teacher 1 :</div>
            <div className="w-3/4">{classroom.teacher1.fullname}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Teacher 2 :</div>
            <div className="w-3/4">{classroom.teacher2.fullname}</div>
          </div>
        </Group>
      </div>

      <div className="row">
        <Title size='xl' mt={50}>Creator's Information</Title>
        <Group className="m-3">
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Fullname :</div>
            <div className="w-3/4">{classroom.creator.fullname ?? "(Undefined)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Email :</div>
            <div className="w-3/4">{classroom.creator.email ?? "(Undefined)"}</div>
          </div>
          <div className="row flex w-full">
            <div className="w-1/4 font-semibold">Phone :</div>
            <div className="w-3/4">{classroom.creator.phone ?? "(Undefined)"}</div>
          </div>
        </Group>
      </div>

            <div className="row">
            <Title size='xl' mt={50}>Lesson Day </Title>
            <Group>
              {lessonLoading ? (
                <LoadingOverlay visible={lessonLoading} overlayProps={{ blur: 2 }} />
              ) : (
                <LessonDayListComponent classroomId={id} loading={lessonLoading} />
              )}
            </Group>
          </div>
    </div>
  
  );
};

export default ClassroomDetailsPage;

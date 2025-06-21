import { useNavigate, useParams } from "react-router-dom";
import StudentTable from "../../general-components/StudentTable";
import { useEffect, useState } from "react";
import { getRequest } from "../../../services/APIService";
import { Group, LoadingOverlay, Title } from "@mantine/core";
import { formatDate } from "../../../utils/dateUtil";

const LessonDateDetailsPage = () => {
  const { id } = useParams();
  const [lessonDate, setLessonDate] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLessonDate = async () => {
    try {
      let result = await getRequest(`/LessonDate/${id}`);
      if (result.status && result.status == true) {
        setLessonDate(result.data);
        console.log("FetchLessonDate: Fetch lessonDate successfully");
      }
    } catch (ex) {
      console.log("FetchLessonDate: Cannot fetch lessonDate " + ex);
    }
  }

  useEffect(() => {
    fetchLessonDate();
    setLoading(false);
    console.log(lessonDate);
  }, [])

  if (loading)
    return <LoadingOverlay visible={loading} overlayBlur={2} />;
  else
    return (
      <div className="">
        <div className="w-full">
          <h2 className="text-4xl font-semibold mb-5 text-center">Lesson Date Information</h2>
          <div className="row">
            <Title size='xl' mt={30}>Main Information</Title>
            <Group className="m-3">
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Lesson Date Id :</div>
                <div className="w-3/4">{lessonDate?.id}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Teacher's Name :</div>
                <div className="w-3/4">{lessonDate?.teacher.fullname}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Room Code :</div>
                <div className="w-3/4 text-wrap">{lessonDate?.room.name}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Date :</div>
                <div className="w-3/4">{formatDate(lessonDate?.date)}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Time :</div>
                <div className="w-3/4">from {lessonDate ? lessonDate.startTime : "--:--:--"} to {lessonDate ? lessonDate.endTime : "--:--:--"} </div>
              </div>
            </Group>
          </div>

          <h2 className="text-4xl font-semibold mb-5 text-center">Lesson Information</h2>
          <div className="row">
            <Title size='xl' mt={30}>Main Information</Title>
            <Group className="m-3">
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Lesson Id :</div>
                <div className="w-3/4">{lessonDate?.lesson.id}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Lesson's Title :</div>
                <div className="w-3/4">{lessonDate?.lesson.name}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Description :</div>
                <div className="w-3/4 text-wrap whitespace-pre-line">{lessonDate?.lesson.description}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Content Before Class :</div>
                <div className="w-3/4 text-wrap whitespace-pre-line">{lessonDate?.lesson.contentBeforeClass}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Content During Class :</div>
                <div className="w-3/4 text-wrap whitespace-pre-line">{lessonDate?.lesson.contentDuringClass}</div>
              </div>
              <div className="row flex w-full">
                <div className="w-1/4 font-semibold">Content After Class :</div>
                <div className="w-3/4 text-wrap whitespace-pre-line">{lessonDate?.lesson.contentAfterClass}</div>
              </div>
            </Group>
          </div>

        </div>
        {lessonDate && <StudentTable classroomId={lessonDate?.classRoom.id} />}
      </div>
    );
}

export default LessonDateDetailsPage;
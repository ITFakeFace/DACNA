import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../../services/APIService";
import { LoadingOverlay } from "@mantine/core";

const StudentLessonDateDetails = () => {
  const { id } = useParams();
  const [lessonDate, setLessonDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLessonDate = async () => {
    try {
      setLoading(true);
      let result = await getRequest(`/lessonDate/${id}`);
      if (result.status && result.status == true) {
        setLessonDate(result.data);
        console.log("FetchLessonDate: Successfully fetch data");
      }
      setLoading(false);
    } catch (ex) {
      console.log("FetchLessonDate: Failed to fetch data");
    }
  }

  useEffect(() => {
    fetchLessonDate();
  }, []);

  if (loading)
    return <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
  else
    return (
      <div className="m-5 flex flex-col items-center">
        <div className="lesson-date-info-container mb-10 w-4/5">
          <div className="text-3xl font-bold w-full text-center">Lesson Information</div>
          <div className="w-full flex text-2xl">
            <div className="w-1/3 xl:w-1/5">Teacher's Name:</div>
            <div>{lessonDate.teacher.fullname}</div>
          </div>
          <div className="w-full flex text-2xl">
            <div className="w-1/3 xl:w-1/5">Room Number:</div>
            <div></div>
          </div>
        </div>
        <div className="content-container w-full items-center flex flex-col gap-5">
          <div className="text-3xl font-bold">Lesson Content</div>
          <div className="main-info border-2 px-10 py-5  rounded-2xl w-4/5">
            <div className="text-3xl font-bold mb-4 border-b-2 pb-3">{lessonDate.lesson.name}</div>
            <div className="text-lg ml-5">{lessonDate.lesson.description}</div>
          </div>
          <div className="w-4/5 flex gap-10">
            <div className="before-box border-2 p-5 rounded-2xl flex-1/3">
              <div className="text-3xl font-bold w-full text-center mb-4 border-b-2 pb-3">Before Class</div>
              <div>{lessonDate.lesson.contentBeforeClass}</div>
            </div>
            <div className="during-box border-2 p-5 rounded-2xl flex-1/3">
              <div className="text-3xl font-bold w-full text-center mb-4 border-b-2 pb-3">During Class</div>
              <div>{lessonDate.lesson.contentDuringClass}</div>
            </div>
            <div className="after-box border-2 p-5 rounded-2xl flex-1/3">
              <div className="text-3xl font-bold w-full text-center mb-4 border-b-2 pb-3">After Class</div>
              <div>{lessonDate.lesson.contentAfterClass}</div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default StudentLessonDateDetails;
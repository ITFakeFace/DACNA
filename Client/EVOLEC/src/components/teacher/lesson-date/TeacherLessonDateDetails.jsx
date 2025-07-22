import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../../services/APIService";
import { LoadingOverlay } from "@mantine/core";

const TeacherLessonDateDetails = () => {
  const { id } = useParams();
  const [lessonDate, setLessonDate] = useState(null);
  const [students, setStudents] = useState();
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
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLessonDate();
  }, []);

  if (loading) {
    return <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
  }

  if (!lessonDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-600 mb-2">Lesson not found</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-3 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Lessons
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Details</h1>
              <p className="text-gray-600">Complete lesson information and class content</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                Active Lesson
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Teacher & Room Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Lesson Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Teacher's Name</div>
                  <div className="text-lg font-semibold text-gray-900">{lessonDate.teacher.fullname}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Room Number</div>
                  <div className="text-lg font-semibold text-gray-900">{lessonDate?.room.name} - {lessonDate?.room.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Lesson Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Lesson Overview
            </h2>
          </div>
          <div className="p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{lessonDate.lesson.name}</h3>
            <div className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
              {lessonDate.lesson.description}
            </div>
          </div>
        </div>

        {/* Class Content Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Before Class */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Before Class
              </h3>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed">
                {lessonDate.lesson.contentBeforeClass || (
                  <div className="text-gray-400 italic">No preparation content specified</div>
                )}
              </div>
            </div>
          </div>

          {/* During Class */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                During Class
              </h3>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed">
                {lessonDate.lesson.contentDuringClass || (
                  <div className="text-gray-400 italic">No class activities specified</div>
                )}
              </div>
            </div>
          </div>

          {/* After Class */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                After Class
              </h3>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed">
                {lessonDate.lesson.contentAfterClass || (
                  <div className="text-gray-400 italic">No follow-up activities specified</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-wrap gap-4 justify-center pt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download Materials
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Mark as Complete
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            View Students
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TeacherLessonDateDetails;
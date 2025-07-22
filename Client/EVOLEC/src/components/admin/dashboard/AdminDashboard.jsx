import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { getRequest } from '../../../services/APIService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [students, setStudents] = useState();
  const [teachers, setTeachers] = useState();
  const [classrooms, setClassrooms] = useState();
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await getRequest('/User/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await getRequest('/User/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await getRequest('/ClassRoom');
      console.log(res);
      setClassrooms(res.Data.$values);
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchStudents(), fetchTeachers(), fetchClassrooms()]);
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  return (
    <div className="p-6 min-h-screen ">
      {/* Header Section */}
      <div className="mb-8">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-cyan-500 bg-clip-text text-transparent mb-2">
                Welcome to EVOLEC Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your English training center efficiently
              </p>
            </div>
            <div className="flex gap-3">
              {/* <Button
                label="Export Data"
                icon="pi pi-download"
                className="p-button-outlined p-button-secondary"
                size="small"
              /> */}
              <Button
                label="Add New Student"
                icon="pi pi-plus"
                className="p-button p-button-primary"
                size="small"
                onClick={() => navigate('/admin/accounts/create')}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Students Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 border-t-4 border-t-blue-500">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="pi pi-users text-blue-600 text-xl"></i>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">
                Total Students
              </p>
              <p className="text-3xl font-bold text-slate-800">{students?.length || "---"}</p>
              <p className="text-slate-500 text-sm">Active enrollments</p>
            </div>
          </div>
        </Card>

        {/* Active Instructors Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 border-t-4 border-t-green-500">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="pi pi-user text-green-600 text-xl"></i>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">
                Active Instructors
              </p>
              <p className="text-3xl font-bold text-slate-800">{teachers?.length || "---"}</p>
              <p className="text-slate-500 text-sm">Teaching staff</p>
            </div>
          </div>
        </Card>

        {/* Running Courses Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 border-t-4 border-t-purple-500">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="pi pi-book text-purple-600 text-xl"></i>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">
                Running Courses
              </p>
              <p className="text-3xl font-bold text-slate-800">{classrooms?.length || "---"}</p>
              <p className="text-slate-500 text-sm">Current semester</p>
            </div>
          </div>
        </Card>
      </div>


      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/admin/classrooms")}
        >
          <div className="p-4 text-center">
            <i className="pi pi-calendar-plus text-blue-600 text-2xl mb-3 block"></i>
            <h4 className="font-semibold text-slate-800 mb-1">Schedule Class</h4>
            <p className="text-sm text-slate-600">Add new class session</p>
          </div>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/admin/accounts")}
        >
          <div className="p-4 text-center">
            <i className="pi pi-check-circle text-green-600 text-2xl mb-3 block"></i>
            <h4 className="font-semibold text-slate-800 mb-1">Manage Accounts</h4>
            <p className="text-sm text-slate-600">Go to Accounts</p>
          </div>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/admin/rooms")}
        >
          <div className="p-4 text-center">
            <i className="pi pi-file-edit text-purple-600 text-2xl mb-3 block"></i>
            <h4 className="font-semibold text-slate-800 mb-1">Control Rooms</h4>
            <p className="text-sm text-slate-600">Get Room Management</p>
          </div>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/admin/courses")}
        >
          <div className="p-4 text-center">
            <i className="pi pi-chart-bar text-orange-600 text-2xl mb-3 block"></i>
            <h4 className="font-semibold text-slate-800 mb-1">View Courses</h4>
            <p className="text-sm text-slate-600">Manage Courses</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
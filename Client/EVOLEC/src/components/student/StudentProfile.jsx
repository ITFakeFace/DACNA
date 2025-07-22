import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Edit3,
  Lock,
  Unlock,
  Copy,
  Check,
  GraduationCap,
  BookOpen
} from "lucide-react";
import { getUserIdFromToken } from "../../services/authService";
import { getRequest } from "../../services/APIService";

const StudentProfile = () => {
  const id = getUserIdFromToken(localStorage.getItem("token"));
  const [copied, setCopied] = useState(false);
  const userId = getUserIdFromToken(localStorage.getItem('token'));
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Day la Password")
        localStorage.getItem('password')
        // console.log(userId);
        const res = await getRequest(`/user/${userId}`); // Sửa đường dẫn API lấy user theo ID
        console.log(res)
        if (res.status && res.data) {
          setUser({
            fullName: res.data.fullname || '',
            dob: res.data.dob || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
            pid: res.data.pid || '',
            address: res.data.address || '',
            gender: res.data.gender || '',
            role: res.data.role || '',
            userName: res.data.userName || '',
            lockout: res.data.lockout || '',
            id: res.data.id || '',
            Password: null,
            ConfirmPassword: null
          });

        } else {
          toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Failed to get profile data' });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to get profile data' });
        console.error(error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);
  // Mock user data for demonstration
  const [user, setUser] = useState({
    id: "usr_123456789",
    userName: "johndoe",
    fullname: "John Doe",
    email: "john.doe@university.edu",
    phoneNumber: "+1 (555) 123-4567",
    dob: "1995-03-15",
    gender: 1, // 1 for male, 0 for female
    pid: "123456789",
    address: "123 University Ave, College Town, ST 12345",
    role: "STUDENT",
    lockout: false
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGender = (gender) => {
    switch (gender) {
      case 0:
        return <span className="text-pink-600 font-medium">Female</span>
      case 1:
        return <span className="text-blue-600 font-medium">Male</span>
      default:
        return <span className="text-gray-400 italic">Not provided</span>
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STUDENT':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserAvatar = () => {
    // Generate a colorful avatar based on initials
    const initials = user.fullname ? user.fullname.split(' ').map(n => n[0]).join('') : user.userName.substring(0, 2).toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const bgColor = colors[user.userName.length % colors.length];

    return (
      <div className={`w-full h-full ${bgColor} flex items-center justify-center text-white text-2xl font-bold`}>
        {initials}
      </div>
    );
  };

  const InfoRow = ({ icon: Icon, label, value, valueClass = "text-gray-900" }) => (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-b-0">
      <div className="flex-shrink-0 mt-1">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className={`text-base break-words ${valueClass}`}>
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </div>
      </div>
    </div>
  );

  const ClassesSection = () => {
    const mockClasses = [
      { id: 1, name: "Advanced Mathematics", semester: "Fall 2024", status: "Active", grade: "A-" },
      { id: 2, name: "Computer Science Principles", semester: "Fall 2024", status: "Active", grade: "B+" },
      { id: 3, name: "Physics I", semester: "Spring 2024", status: "Completed", grade: "A" },
      { id: 4, name: "English Literature", semester: "Spring 2024", status: "Completed", grade: "B" }
    ];

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Studied & Studying Classes
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Class Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Semester</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Grade</th>
                </tr>
              </thead>
              <tbody>
                {mockClasses.map((cls) => (
                  <tr key={cls.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{cls.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{cls.semester}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{cls.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
              <p className="text-gray-600 mt-1">Manage user information and permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 h-32">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="relative px-6 pb-6">
                <div className="flex flex-col items-center -mt-16">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                      {getUserAvatar()}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user?.role)}`}>
                      {user?.role}
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {user?.fullname || user?.userName}
                    </h2>
                    <p className="text-gray-600">@{user?.userName}</p>
                  </div>

                  <div className="w-full mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">User ID</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-900" title={user.id}>
                          {user.id?.substring(0, 12)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title={copied ? 'Copied!' : 'Copy ID'}
                        >
                          {copied ?
                            <Check className="w-4 h-4 text-green-600" /> :
                            <Copy className="w-4 h-4 text-gray-600" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

                <div className="space-y-1">
                  <InfoRow
                    icon={User}
                    label="Full Name"
                    value={user?.fullname}
                  />

                  <InfoRow
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                    valueClass="text-blue-600"
                  />

                  <InfoRow
                    icon={Phone}
                    label="Phone Number"
                    value={user?.phoneNumber}
                  />

                  <InfoRow
                    icon={Calendar}
                    label="Date of Birth"
                    value={user?.dob ? new Date(user.dob).toLocaleDateString() : null}
                  />

                  <InfoRow
                    icon={User}
                    label="Gender"
                    value={user?.gender !== undefined ? getGender(user?.gender) : null}
                    valueClass=""
                  />

                  <InfoRow
                    icon={CreditCard}
                    label="National ID"
                    value={user?.pid}
                  />

                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={user?.address}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        {/* {(user?.role === "STUDENT" || user?.role === "TEACHER") && (
          <div className="mt-8">
            <ClassesSection />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default StudentProfile;
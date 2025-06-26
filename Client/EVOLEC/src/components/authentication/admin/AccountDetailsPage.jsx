import { useNavigate, useParams } from "react-router-dom";
import StudentFemale from '../../../assets/user/avatar/Student_Female.png';
import StudentMale from '../../../assets/user/avatar/Student_Male.png';
import TeacherFemale from '../../../assets/user/avatar/Teacher_Female.png';
import TeacherMale from '../../../assets/user/avatar/Teacher_Male.png';
import EmployeeFemale from '../../../assets/user/avatar/Employee_Female.png';
import EmployeeMale from '../../../assets/user/avatar/Employee_Male.png';
import UserUndefined from '../../../assets/user/avatar/User_Undefined.png';
import { Image } from "primereact/image";
import { ActionIcon, CopyButton, LoadingOverlay, Title, Tooltip } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { getRequest, putRequest } from "../../../services/APIService";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { formatDate } from "../../../utils/dateUtil";
import { Tag } from "primereact/tag";
import StudyClassTable from "../../general-components/StudyClassTable";
import TeachClassTable from "../../general-components/TeachClassTable";
// import { faCopy } from "@fortawesome/free-regular-svg-icons";
const AccountDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      let result = await getRequest(`user/${id}`);
      if (result.status && result.status == true) {
        setUser(result.data);
        console.log("FetchUser: Fetch user successfully");
      }
      setLoading(false);
    } catch (ex) {
      console.log("FetchUser: Fetch user failed");
    }
  }

  const getUserAvatar = (user) => {
    if (!user)
      return null;
    if (user.gender === 1)
      if (user.role === "STUDENT")
        return StudentMale;
      else if (user.role === "TEACHER")
        return TeacherMale;
      else
        return EmployeeMale;
    else if (user.gender === 0)
      if (user.role === "STUDENT")
        return StudentFemale;
      else if (user.role === "TEACHER")
        return TeacherFemale;
      else
        return EmployeeFemale;
    else
      return UserUndefined;
  }

  const userStatusOnClick = async (user, enable) => {
    try {
      console.log(`/user/ban/${user?.id}?enable=${enable}`);
      var result = await putRequest(`/user/ban/${user?.id}?enable=${enable}`);
      if (result.status && result.status == true) {
        fetchUser();
        console.log("userStatusOnClick: Successfully ban/unban user");
      }
    } catch (ex) {
      console.log("userStatusOnClick: Failed to ban/unban user");
    }
  }

  const getGender = (gender) => {
    switch (gender) {
      case 0:
        return <span className="!text-female">Female</span>
      case 1:
        return <span className="!text-male">Male</span>
      default:
        return <span className="text-gray-400">Not provided</span>
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchUser();
    setLoading(false);
    console.log(user);
  }, []);

  const notProvideSpan = (
    <span className="text-gray-400 italic">Not provided</span>
  );

  const getInformation = () => {
    if (user?.role === "STUDENT")
      return (
        <div>
          <Title order={3} size={36}>Studied & Studying Class</Title>
          <StudyClassTable studentId={user?.id} />
        </div>
      );
    else if (user?.role === "TEACHER")
      return (
        <div>
          <Title order={3} size={36}>Teached & Teaching Class</Title>
          <TeachClassTable teacherId={user?.id} />
        </div>
      );
    return null;
  }

  if (loading == true)
    return <LoadingOverlay visible={loading} />
  else
    return (
      <div className="w-full flex flex-col p-10 gap-10">
        <div className="w-full flex md:flex-row flex-col gap-10">
          <div className="left-box flex md:flex-col flex-row md:w-3/10 min-w-75 w-full h-fit gap-10">
            <div className="w-full flex flex-col items-center p-5 border-2 rounded-2xl">
              <Image src={getUserAvatar(user)} className="avatar" width="300" />
              <div className="w-full flex justify-center items-center gap-0">
                <span
                  className="font-medium text-4xl text-center break-words max-w-full truncate"
                  style={{ maxWidth: "100%", overflowWrap: "break-word", wordBreak: "break-word" }}
                  title={user?.userName}
                >
                  {user?.userName}
                </span>
              </div>
              <div className="w-full flex justify-center text-xl mt-3">
                <span className="w-fit pr-2 flex-none font-bold whitespace-nowrap">Id:</span>
                <span
                  className="max-w-fit grow overflow-hidden text-ellipsis whitespace-nowrap"
                  title={id} // Tooltip đầy đủ nếu muốn xem full
                >
                  {id}
                </span>
                <span className="w-fit pl-2 flex-none">
                  <CopyButton value={id} timeout={2000} >
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                        <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-10 md:w-7/10 w-full p-5 border-2 rounded-2xl">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-3 items-center">
                <Title order={3} size={36}>User Details</Title>
              </div>
              <div className="h-full flex flex-row items-center gap-3">
                <Button className="!text-xl" severity="info" onClick={() => navigate(`/admin/accounts/update/${user?.id}`)}><i className="pi pi-pencil" /></Button>
                {user?.role != "ADMIN" && (user?.lockout ?
                  <Button className="!text-xl h-fit" severity="success" onClick={() => userStatusOnClick(user, true)}><i className="pi pi-unlock" /></Button> :
                  <Button className="!text-xl h-fit" severity="danger" onClick={() => userStatusOnClick(user, false)}><i className="pi pi-lock" /></Button>)
                }
              </div>
            </div>
            <div className="w-full ml-5 grid grid-cols-1 xl:grid-cols-12 gap-y-4 text-2xl md:text-3xl">
              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Full Name:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.fullname}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">User Name:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.userName}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Email:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.email}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Phone:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.phoneNumber}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Date of Birth:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.dob ? formatDate(user?.dob) : notProvideSpan}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Gender:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.gender ? getGender(user?.gender) : notProvideSpan}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">National ID:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.pid}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Address:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.address ? user?.address : notProvideSpan}</div>

              <div className="col-span-5 lg:col-span-4 xl:col-span-3 font-medium text-left pr-3">Role:</div>
              <div className="col-span-7 lg:col-span-8 xl:col-span-9 text-gray-700 break-words">{user?.role}</div>
            </div>
          </div>
        </div>
        {
          user?.role == "STUDENT" || user?.role == "TEACHER" &&
          <div className="border-2 rounded-2xl p-10">
            {getInformation()}
          </div>
        }
      </div>
    );
}

export default AccountDetailsPage;
import { useParams } from "react-router-dom";
import StudentFemale from '../../../assets/user/avatar/Student_Female.png';
import StudentMale from '../../../assets/user/avatar/Student_Male.png';
import { Image } from "primereact/image";
import { ActionIcon, CopyButton, Title, Tooltip } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { getRequest } from "../../../services/APIService";
import { useEffect, useState } from "react";
// import { faCopy } from "@fortawesome/free-regular-svg-icons";
const AccountDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      let result = await getRequest(`user/${id}`);
      if (result.status && result.status == true) {
        setUser(result.data);
        console.log("FetchUser: Fetch user successfully");
      }
    } catch (ex) {
      console.log("FetchUser: Fetch user failed");
    }
  }

  useEffect(() => {
    fetchUser();
    setLoading(false);
    console.log(user);
  }, []);

  return (
    <div className="w-full flex md:flex-row flex-col p-10 gap-10">
      <div className="left-box md:flex-col flex-row md:w-3/10 w-full p-5 border-2 rounded-2xl">
        <div className="w-full flex flex-col items-center">
          <Image src={StudentMale} className="avatar" width="300" />
          <div className="w-full flex justify-center items-center gap-0">
            <span className="font-medium text-3xl text-center">{user?.userName}</span>
          </div>
          <div className="w-full flex justify-center">
            <div className="inline-flex items-center gap-2">
              <span className="font-bold whitespace-nowrap">Id:</span>
              <span
                className="block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                title={id} // Tooltip đầy đủ nếu muốn xem full
              >
                {id}
              </span>
              <CopyButton value={id} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
          </div>



        </div>
      </div>
      <div className="right-box md:w-7/10 w-full p-5 border-2 rounded-2xl">
        <Title order={3}>User Details</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Full Name:</span>
            <span className="text-gray-700 break-words">Administrator</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Username:</span>
            <span className="text-gray-700 break-words">Admin</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Email:</span>
            <span className="text-gray-700 break-words">admin@example.com</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Phone:</span>
            <span className="text-gray-700 break-words">0900000001</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Date of Birth:</span>
            <span className="text-gray-700 break-words">01-01-2000</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Gender:</span>
            <span className="text-gray-700 break-words">Male</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">National ID:</span>
            <span className="text-gray-700 break-words">079200000001</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Address:</span>
            <span className="text-gray-400 italic break-words">Not provided</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">Role:</span>
            <span className="text-gray-700 break-words">ADMIN</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium whitespace-nowrap">ID:</span>
            <span className="text-gray-700 break-words break-all">0dd60efa-cd87-490d-91ed-a6edb11fa732</span>
          </div>
        </div>

      </div>
    </div>
  )
}
export default AccountDetailsPage;
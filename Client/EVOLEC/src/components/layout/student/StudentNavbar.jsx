import { faCompress, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavItem from "../components/NavItem";
import { Button } from "@mantine/core";
import './StudentNavbar.css'

const StudentNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/student"
  return (
    <NavbarTemplate
      isOpened={isOpened}
      setOpened={setOpened}
    >
      <NavItem
        icon={<FontAwesomeIcon icon={faHome} />}
        title="Dashboard"
        isOpened={isOpened}
        url={`${pathRoot}/dashboard`}
      ></NavItem>
    </NavbarTemplate>
  )
};

export default StudentNavbar;
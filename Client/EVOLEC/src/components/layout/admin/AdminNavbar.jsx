
import { Button } from '@mantine/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faHome, faSchool, faUser } from "@fortawesome/free-solid-svg-icons";
import './AdminNavbar.css';
import NavItem from '../components/NavItem';
import EVOLEC_LogoRectangle from '../../../assets/web_logo/EVOLEC_LogoRectangle.png';
import EVOLEC_LogoSquare from '../../../assets/web_logo/EVOLEC_LogoSquare.jpg';
import EVOLEC_LogoRectangle_Portrait from '../../../assets/web_logo/EVOLEC_LogoRectangle_Portrait.png';
import NavbarTemplate from '../components/NavbarTemplate';

const AdminNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/admin";
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
      <NavItem
        icon={<FontAwesomeIcon icon={faUser} />}
        title="Accounts"
        isOpened={isOpened}
        url={`${pathRoot}/accounts`}
      ></NavItem>
      <NavItem
        icon={<FontAwesomeIcon icon={faSchool} />}
        title="Courses"
        isOpened={isOpened}
        url={`${pathRoot}/courses`}
      ></NavItem>

      <NavItem
        icon={<FontAwesomeIcon icon={faSchool} />}
        title="classroom"
        isOpened={isOpened}
        url={`${pathRoot}/classrooms`}
      ></NavItem>


    </NavbarTemplate>
  )
};

export default AdminNavbar;
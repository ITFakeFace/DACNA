import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faHome, faSchool} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';
import './AcademicAdminNavbar.css'
import NavItem from '../components/NavItem';
import NavbarTemplate from '../components/NavbarTemplate';

const AcademicAdminNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/academic-admin"
  return (
    <NavbarTemplate
    isOpened={isOpened}
    setOpened={setOpened}> 
      <NavItem
        icon={<FontAwesomeIcon icon={faHome} />}
        title="Dashboard"
        isOpened={isOpened}
        url={`${pathRoot}/dashboard`}
      ></NavItem>
       <NavItem
        icon={<FontAwesomeIcon icon={faSchool} />}
        title="Courses"
        isOpened={isOpened}
        url={`${pathRoot}/courses`}
      ></NavItem>
    </NavbarTemplate>
  )
};

export default AcademicAdminNavbar
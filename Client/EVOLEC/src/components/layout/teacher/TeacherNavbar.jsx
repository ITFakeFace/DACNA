import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavItem from '../components/NavItem';
import { Button } from '@mantine/core';
import { faCompress, faHome } from '@fortawesome/free-solid-svg-icons';
import './TeacherNavbar.css'

const TeacherNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/teacher"
  return (
    <NavbarTemplate>
      <NavItem
        icon={<FontAwesomeIcon icon={faHome} />}
        title="Dashboard"
        isOpened={isOpened}
        url={`${pathRoot}/dashboard`}
      ></NavItem>
    </NavbarTemplate>
  )
};

export default TeacherNavbar;
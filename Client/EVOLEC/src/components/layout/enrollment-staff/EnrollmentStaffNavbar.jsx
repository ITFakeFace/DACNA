import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavItem from '../components/NavItem';
import { faCompress, faHome } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';
import './EnrollmentStaffNavbar.css'
import NavbarTemplate from '../components/NavbarTemplate';

const EnrollmentStaffNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/enrollment-staff"
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

export default EnrollmentStaffNavbar;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompress, faHome } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';
import './AcademicAdminNavbar.css'
import NavItem from '../components/NavItem';

const AcademicAdminNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/academic-admin"
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

export default AcademicAdminNavbar
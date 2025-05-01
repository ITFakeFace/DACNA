import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavItem from '../components/NavItem';
import { faCompress, faHome } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mantine/core';
import './EnrollmentStaffNavbar.css'

const EnrollmentStaffNavbar = ({ isOpened, setOpened }) => {
  const pathRoot = "/enrollment-staff"
  return (
    <div
      className="nav-container"
      style={{ width: "100%", height: "100vh", paddingLeft: isOpened ? 5 : 10, paddingRight: isOpened ? 0 : 10 }}
    >
      <div className='nav-row'>
        <div className='logo'>
          <img src="" alt="" style={{ width: "100%", height: 100 }} />
        </div>
        <NavItem
          icon={<FontAwesomeIcon icon={faHome} />}
          title="Dashboard"
          isOpened={isOpened}
          url={`${pathRoot}/dashboard`}
        ></NavItem>
      </div>
      <div className='nav-row-bottom'>
        <Button onClick={() => setOpened((o) => !o)}>
          <FontAwesomeIcon icon={faCompress} />
        </Button>
      </div>
    </div>
  )
};

export default EnrollmentStaffNavbar;
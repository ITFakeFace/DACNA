
import { Button } from '@mantine/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import './AdminNavbar.css';
import NavItem from './NavItem';


const AdminNavbar = ({ isOpened, setOpened }) => {

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
          url="/admin/dashboard"
        ></NavItem>
        <NavItem
          icon={<FontAwesomeIcon icon={faUser} />}
          title="Accounts"
          isOpened={isOpened}
          url="/admin/accounts"
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

export default AdminNavbar;
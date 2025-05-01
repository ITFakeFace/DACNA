import { faCompress, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mantine/core";
import React, { Children, useEffect } from "react";
import EVOLEC_LogoRectangle from '../../../assets/web_logo/EVOLEC_LogoRectangle.png';
import EVOLEC_LogoSquare from '../../../assets/web_logo/EVOLEC_LogoSquare.jpg';
import EVOLEC_LogoRectangle_Portrait from '../../../assets/web_logo/EVOLEC_LogoRectangle_Portrait.png';
import './NavbarTemplate.css';

const NavbarTemplate = ({ isOpened, setOpened, children }) => {

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div
      className="nav-container"
      style={{ width: "100%", height: "100vh", paddingLeft: isOpened ? 5 : 0, paddingRight: isOpened ? 0 : 0 }}
    >
      <div className='nav-row'>
        <a href='/'>
          <div className='logo' style={{ width: "100%", height: 100, position: "relative" }}>
            <img
              key={isOpened ? 'landscape' : 'portrait'} // để React re-render ảnh khi key thay đổi
              className={`logo-img ${isOpened ? 'logo-img-landscape' : 'logo-img-portrait'} fade-logo`}
              src={EVOLEC_LogoSquare}
              alt=""
            />
          </div>
        </a>
        {children}
      </div>
      <div className='nav-row-bottom w-full gap-1.5' style={{ flexWrap: isOpened ? "nowrap" : "wrap" }}>
        <Button fullWidth onClick={logout} >
          <FontAwesomeIcon className="rotate-180" icon={faRightFromBracket} />
          <span className='title-content'>{isOpened ? "Logout" : ""}</span>
        </Button>
        <Button fullWidth onClick={() => setOpened((o) => !o)}>
          <FontAwesomeIcon icon={faCompress} />
          <span className='title-content'>{isOpened ? "Collapse" : ""}</span>
        </Button>
      </div>
    </div >
  )
};
export default NavbarTemplate;
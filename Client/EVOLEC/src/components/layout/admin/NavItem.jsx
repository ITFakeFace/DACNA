import { Button } from '@mantine/core';
import './NavItem.css';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon, title, isOpened, url }) => {
  const navigate = useNavigate();
  const urlPage = () => {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean); // Loại bỏ phần tử rỗng

    return parts[1] ?? "Dashboard"; // Bây giờ "admin" ở vị trí [1]
  };

  return (
    <div className="w-full" onClick={() => navigate(url)}>
      <Button
        fullWidth
        className={["w-full", "btn-item", isOpened ? "border-left-only btn-align-left" : "", urlPage().toUpperCase() == title.toUpperCase() ? "btn-item-focus" : ""]}
        radius="md"
        bg="transparent"
        h={"auto"}
        p="md"
      >
        <span className='icon-content'>{icon}</span>
        <span className='title-content'>{isOpened ? title : ""}</span>
      </Button>
    </div>
  )
}

export default NavItem;
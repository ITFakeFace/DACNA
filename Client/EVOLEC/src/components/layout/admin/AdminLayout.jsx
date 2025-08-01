import { AppShell, Burger, Button, Group, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { useEffect, useState } from 'react';
import { getRoleFromToken } from '../../../services/authService';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const [navOpened, setNavOpened] = useState(true);
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (token == null || token == "") {
    //   navigate('/login');
    // }
    // if (getRoleFromToken(token) != "ADMIN") {
    //   alert("Yêu cầu quyền truy cập")
    //   navigate('/');
    // }
  })

  return (
    <AppShell
      layout="alt"
      // header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: navOpened ? 300 : 75, collapsed: { mobile: !opened } }}
      //aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      {/* <AppShell.Header>
        <Group h="100%" px="md">
          <Burger onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header> */}
      <AppShell.Navbar>
        <AdminNavbar isOpened={navOpened} setOpened={setNavOpened}></AdminNavbar>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      {/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
      <AppShell.Footer p="md">
        <p>&copy; {new Date().getFullYear()} EVOLEC. All rights reserved.</p>
      </AppShell.Footer>
    </AppShell>
  );
}

export default AdminLayout;
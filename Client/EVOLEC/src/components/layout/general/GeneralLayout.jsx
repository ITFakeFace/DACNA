import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import './GeneralLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRoleFromToken, getUsernameFromToken } from '../../../services/authService';
const GeneralLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const userRole = getRoleFromToken(token);
      const userUsername = getUsernameFromToken(token);

      console.log(userRole);
      console.log(userUsername);

      setRole(userRole);
      setUsername(userUsername);

      setLogged(true);
    }
  }, []);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className='header'>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="lg" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group>
              <MantineLogo size={30} />
              <Group ml="sm" gap={15} visibleFrom="sm">
                <UnstyledButton size="md">Trang chủ</UnstyledButton>
                <UnstyledButton size="md">Thông tin đào tạo</UnstyledButton>
                <UnstyledButton size="md">Về chúng tôi</UnstyledButton>
              </Group>
            </Group>
            <Group gap={15} visibleFrom="sm">
              {logged
                ? <UnstyledButton type='button' onClick={() => navigate(role == "ADMIN" || role == "STAFF" ? "/admin" : "/student")}>{username}</UnstyledButton>
                : <UnstyledButton type='button' onClick={() => navigate('/login')}>Đăng nhập</UnstyledButton>}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton>Trang chủ</UnstyledButton>
        <UnstyledButton>Thông tin đào tạo</UnstyledButton>
        <UnstyledButton>Về chúng tôi</UnstyledButton>
        <UnstyledButton type='button' onClick={() => navigate('/login')}>Đăng nhập</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main className='flex'>
        <Outlet></Outlet>
      </AppShell.Main>
    </AppShell>
  );
}

export default GeneralLayout;
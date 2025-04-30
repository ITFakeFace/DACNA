import { AppShell, Text } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function StudentLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token == null || token == "") {
      navigate('/login');
    }
    if (getRoleFromToken(token) != "STUDENT") {
      alert("Yêu cầu quyền truy cập")
      navigate('/');
    }
  })
  return (
    <AppShell>
      <AppShell.Header height={60} p="md" withBorder>
        <Text weight={500}>Student Portal</Text>
      </AppShell.Header>

      <AppShell.Main p="md">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

import { AppShell, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
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

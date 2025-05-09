import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useState } from "react";
import AcademicAdminNavbar from "./AcademicAdminNavbar";
import { Outlet } from "react-router-dom";

const AcademicAdminLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [navOpened, setNavOpened] = useState(true);
  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: navOpened ? 300 : 75, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      //aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AcademicAdminNavbar isOpened={navOpened} setOpened={setNavOpened} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      {/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
      <AppShell.Footer p="md">Footer</AppShell.Footer>

    </AppShell>
  )
};

export default AcademicAdminLayout;
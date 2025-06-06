import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useDisclosure } from "@mantine/hooks";

const StudentLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [navOpened, setNavOpened] = useState(true);
  useEffect(()=>{
    console.log(1)
  })
  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: navOpened ? 300 : 75, breakpoint: 'sm', collapsed: { mobile: !opened } }}
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
        <StudentNavbar isOpened={navOpened} setOpened={setNavOpened} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      {/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
      <AppShell.Footer p="md">Footer</AppShell.Footer>
    </AppShell>
  )
};

export default StudentLayout;

import { AppShell, Burger, NavLink, Title } from '@mantine/core';
import { Link, Outlet } from 'react-router';

import styles from './styles.module.css';
import { useLayout } from './useLayout';

const Layout = () => {
  const { opened, toggle, navLinks, pathname } = useLayout();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" ml="md" mt="md" />
        <Title order={3} className={styles.title} ml="md" mt="md">
          Investments
        </Title>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navLinks.map((navLink) => (
          <NavLink
            key={navLink.path}
            component={Link}
            to={navLink.path}
            label={navLink.label}
            active={pathname === navLink.path}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;

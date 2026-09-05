import { useLocation } from 'react-router';

import { useDisclosure } from '@mantine/hooks';

import type { INavLink } from './types';

const navLinks: INavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'Vertical Spreads', path: '/vertical-spreads' },
];

export const useLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { pathname } = useLocation();

  return {
    opened,
    toggle,
    navLinks,
    pathname,
  };
};

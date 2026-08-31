import { Group } from '@mantine/core';
import { Link } from 'react-router';
import styles from './styles.module.css';

const Navbar = () => {
  return (
    <Group className={styles.container} component="nav" gap="lg">
      <Link className={styles.link} to="/">
        Home
      </Link>
      <Link className={styles.link} to="/vertical-spreads">
        Vertical Spreads
      </Link>
    </Group>
  );
};

export default Navbar;

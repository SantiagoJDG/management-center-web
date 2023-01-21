import { Drawer } from '@mui/material';
import { useRouter } from 'next/router';

import useAuth from '../../hooks/useAuth';
import UserInfo from '../User/UserInfo';

const Sidebar = ({ window, drawerWidth, mobileOpen, setMobileOpen }) => {
  const { userData } = useAuth();

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Drawer
        container={container}
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <UserInfo userDataLogged={userData}></UserInfo>
      </Drawer>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
        }}
      >
        <UserInfo userDataLogged={userData}></UserInfo>
      </Drawer>
    </>
  );
};

export default Sidebar;

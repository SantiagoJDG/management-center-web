import { Drawer } from '@mui/material';
import { useRouter } from 'next/router';

import useAuth from '../../hooks/useAuth';
import UserInfo from '../User/UserInfo';

const Sidebar = ({ window, drawerWidth, mobileOpen, setMobileOpen }) => {
  const router = useRouter();

  const { userData } = useAuth();

  const container = window !== undefined ? () => window().document.body : undefined;

  const pagesList = [
    { name: 'Home', path: '/', view: ['administrador'] },
    {
      name: 'Lista Consultores',
      path: '/collaborators',
      view: ['administrador']
    },
    { name: 'Mi Ficha', path: '/collaborator', view: ['administrador'] },
    { name: 'Nueva Ficha', path: '/new-collaborator', view: ['administrador'] }
  ];

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

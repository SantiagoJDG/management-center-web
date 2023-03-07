import { Drawer, Box, Divider, CardMedia } from '@mui/material';

import useAuth from 'hooks/useAuth';
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
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CardMedia
            sx={{
              width: 150,
              height: 40,
              margin: 1
            }}
            image="consultec_logo_name.png"
          />
        </Box>
        <Divider sx={{ width: '90%', alignSelf: 'center' }} />
        <Box
          sx={{
            p: 0.5,
            backgroundImage: "url('/background_sidebar.png')",
            backgroundSize: 'auto',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
            height: '100vh'
          }}
        >
          <UserInfo userDataLogged={userData}></UserInfo>
        </Box>
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

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
    <Drawer
      data-testid="sidebar"
      container={container}
      variant="permanent"
      open={mobileOpen}
      onClose={handleDrawerToggle}
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
  );
};

export default Sidebar;

import { Drawer, Box, CardMedia } from '@mui/material';

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
      backgroundColor="#0288d1"
      data-testid="sidebar"
      container={container}
      variant="permanent"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        backgroundColor: '#0288d1'
      }}
    >
      <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', backgroundColor: '#0288d1' }}>
        <CardMedia
          sx={{
            width: 143,
            height: 30,
            margin: 1
          }}
        />
      </Box>
      <Box
        sx={{
          p: 0.5,

          backgroundSize: 'auto',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          backgroundColor: '#0288d1'
        }}
      >
        <UserInfo userDataLogged={userData}></UserInfo>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

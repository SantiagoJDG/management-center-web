import { useRouter } from 'next/router';
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import useAuth from '../../hooks/useAuth';

const MainHeader = ({ drawerWidth, mobileOpen, setMobileOpen }) => {
  const { userToken, getUserData, setUserToken } = useAuth();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    /*global google */
    google.accounts.id.revoke(getUserData().ID, () => {
      sessionStorage.clear();
    });
    sessionStorage.removeItem('center-token');
    setUserToken(undefined);
    router.push('/');
  };

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}
    >
      <Toolbar>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="open sidebar"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sistema de gestion Consultec-TI
        </Typography>

        {!userToken && <div style={{}} id="buttonDiv"></div>}

        {userToken && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Cerra sesion">
              <IconButton onClick={logout} sx={{ p: 0 }}>
                <Avatar alt="Edgar A Guevara" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;

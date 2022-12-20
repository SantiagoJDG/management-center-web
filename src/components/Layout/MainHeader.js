import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import useAuth from '../../hooks/useAuth';

const MainHeader = ({ drawerWidth, mobileOpen, setMobileOpen }) => {
  const { getUserData } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    /*global google */
    google.accounts.id.revoke(getUserData().ID, () => {
      sessionStorage.clear();
    });
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

        <div style={{}} id="buttonDiv"></div>
        <button onClick={logout}>SALIR</button>
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;

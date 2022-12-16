import { Box, Grid, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


const MainHeader = ({ drawerWidth, mobileOpen, setMobileOpen }) => {

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (

    <AppBar position="static" color="primary"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}>
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
      </Toolbar>
    </AppBar>
  )
}

export default MainHeader;

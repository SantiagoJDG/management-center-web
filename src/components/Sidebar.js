import { useRouter } from 'next/router';
import {
  Drawer, ListItem, List, ListItemIcon, ListItemButton, ListItemText, Toolbar, Divider, Icon
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = ({ window, drawerWidth, mobileOpen, setMobileOpen }) => {

  const router = useRouter();
  const container = window !== undefined ? () => window().document.body : undefined;

  const pagesList = [
    { name: 'Home', path: '/', view: ['administrador'] },
    { name: 'Lista Consultores', path: '/collaborators', view: ['administrador'] },
    { name: 'Ficha Consultor', path: '/collaborator', view: ['administrador'] }];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRouting = (path) => {
    router.push(path)
  };

  const getIcon = (path) => {
    switch (path) {
      case '/collaborator':
        return (
          < ListItemIcon >
            <PersonIcon />
          </ListItemIcon >
        );
      case '/collaborators':
        return (
          < ListItemIcon >
            <GroupsIcon />
          </ListItemIcon >
        );

      default:
        return (
          < ListItemIcon >
            <HomeIcon />
          </ListItemIcon >
        );
    }
  };

  const menuOptions = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {pagesList.map((page, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleRouting(page.path)} >
              {getIcon(page.path)}
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        container={container}
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {menuOptions}
      </Drawer>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {menuOptions}
      </Drawer>
    </>
  );

}

export default Sidebar;

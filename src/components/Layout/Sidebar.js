import { Drawer, CardMedia } from '@mui/material';
import {
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Box,
  Tooltip
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import { useRouter } from 'next/router';
const Sidebar = ({ window, drawerWidth, mobileOpen, setMobileOpen }) => {
  const router = useRouter();
  const handleIconClickPlaner = () => {
    router.push('/planner');
  };

  const handleIconClickListCollaborador = () => {
    router.push('/collaborators');
  };

  const handleIconClickAddCollaborador = () => {
    router.push('/create-collaborator-steps');
  };

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
        <List data-testid="user-info-component" dense sx={{ padding: 2.5 }}>
          <ListItem
            disablePadding
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginTop: '1px',
              marginBottom: '1px'
            }}
          >
            <Tooltip title="Planificacion Estratégica">
              <ListItemIcon onClick={handleIconClickPlaner}>
                <CalendarMonthIcon
                  color="white"
                  fontSize="large"
                  style={{ fontSize: 40, color: 'white' }}
                />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              title="Planificacion Estratégica"
              secondary={<Typography variant="body2" style={{ fontSize: 12 }}></Typography>}
            />
          </ListItem>
          <br></br>
          <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Tooltip title="Agregar nuevo colaborador.">
              <ListItemIcon onClick={handleIconClickAddCollaborador}>
                <AccountCircleIcon
                  data-testid="mock-icon"
                  color="aliceblue"
                  fontSize="large"
                  style={{ fontSize: 40, color: 'white' }}
                />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              title="Agregar nuevo colaborador."
              secondary={useAuth.supervisorData?.name}
            />
          </ListItem>
          <br></br>
          <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Lista de colaboradores.">
              <ListItemIcon onClick={handleIconClickListCollaborador}>
                <GroupsIcon color="aliceblue" style={{ fontSize: 40, color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              title="Lista de colaboradores."
              secondary={useAuth.supervisorData?.name}
            />
          </ListItem>
          <br></br>
          <br></br>
          <ListItem disablePadding>
            <Tooltip title="Opciones">
              <ListItemIcon>
                <ConstructionIcon
                  color="white"
                  fontSize="large"
                  style={{ fontSize: 40, color: 'white' }}
                />
                <ListItemText title="Opciones" secondary={useAuth.supervisorData?.name} />
              </ListItemIcon>
            </Tooltip>
            <Box sx={{ display: 'block' }}>
              <ListItemText title="N-1 Perfil" />
              <ListItemText
                component="div"
                primary={useAuth.profilesData?.slice(0, 8).map((value, index) => (
                  <Chip
                    sx={{ margin: 0.2 }}
                    color="info"
                    size="small"
                    key={index}
                    label={value.name}
                  />
                ))}
              />
            </Box>
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon></ListItemIcon>
            <Box sx={{ display: 'block' }}>
              <ListItemText title=" N-2 Conocimientos:" />
              <ListItemText
                component="div"
                primary={useAuth.knowledges?.slice(0, 8).map((value, index) => (
                  <Chip
                    sx={{ margin: 0.2 }}
                    color="info"
                    size="small"
                    key={index}
                    label={value.name}
                  />
                ))}
              />
            </Box>
          </ListItem>
          <ListItem
            disablePadding
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginTop: '1px',
              marginBottom: '1px'
            }}
          ></ListItem>
          <ListItem disablePadding>
            <ListItemIcon></ListItemIcon>
            <Box sx={{ display: 'block' }}>
              <ListItemText title=" N-3 Tecnologias:" />
              <ListItemText
                component="div"
                primary={useAuth.technologies?.slice(0, 8).map((value, index) => (
                  <Chip
                    sx={{ margin: 0.2 }}
                    color="info"
                    size="small"
                    key={index}
                    label={value.name}
                  />
                ))}
              />
            </Box>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

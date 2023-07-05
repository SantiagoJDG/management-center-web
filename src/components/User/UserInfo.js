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
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import { useRouter } from 'next/router';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged }) => {
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

  if (!userDataLogged) {
    return 'There is no user Data';
  } else {
    return (
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
        </ListItem>{' '}
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
            secondary={userDataLogged.supervisorData?.name}
          />
        </ListItem>{' '}
        <br></br>
        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Lista de colaboradores.">
            <ListItemIcon onClick={handleIconClickListCollaborador}>
              <GroupsIcon color="aliceblue" style={{ fontSize: 40, color: 'white' }} />
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            title="Lista de colaboradores."
            secondary={userDataLogged.supervisorData?.name}
          />
        </ListItem>{' '}
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
              <ListItemText title="Opciones" secondary={userDataLogged.supervisorData?.name} />
            </ListItemIcon>
          </Tooltip>
          <Box sx={{ display: 'block' }}>
            <ListItemText title="N-1 Perfil" />
            <ListItemText
              component="div"
              primary={userDataLogged.profilesData?.slice(0, 8).map((value, index) => (
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
              primary={userDataLogged.knowledges?.slice(0, 8).map((value, index) => (
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
              primary={userDataLogged.technologies?.slice(0, 8).map((value, index) => (
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
    );
  }
};

export default UserInfo;

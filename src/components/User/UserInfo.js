import {
  Avatar,
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
import moment from 'moment';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged }) => {
  const admissionDateFormated = moment(userDataLogged.admissionDate).format('LL');
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
            <ListItemIcon>
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
        <br></br> <br></br>
        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Tooltip title="Agregar nuevo colaborador.">
            <ListItemIcon>
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
            <ListItemIcon>
              <GroupsIcon color="aliceblue" style={{ fontSize: 40, color: 'white' }} />
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            title="Lista de colaboradores."
            secondary={userDataLogged.supervisorData?.name}
          />
        </ListItem>{' '}
        <br></br>
        <ListItem disablePadding>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary="Cliente" secondary={userDataLogged.clientData?.name} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ConstructionIcon
              color="white"
              fontSize="large"
              style={{ fontSize: 40, color: 'white' }}
            />
            <ListItemText title="Opciones" secondary={userDataLogged.supervisorData?.name} />
          </ListItemIcon>
          <Box sx={{ display: 'block' }}>
            <ListItemText primary="N-1 Perfil" />
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
            <ListItemText primary=" N-2 Conocimientos:" />
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
            <ListItemText primary=" N-3 Tecnologias:" />
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

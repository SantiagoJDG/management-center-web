import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged }) => {
  const admissionDateFormated = moment(userDataLogged.admissionDate).format('LL');
  if (!userDataLogged) {
    return 'There is no user Data';
  } else {
    return (
      <List dense sx={{ padding: 1.5 }}>
        <ListItem disablePadding sx={{ mb: 3, padding: 0.5 }}>
          <ListItemIcon>
            <Avatar alt={userDataLogged.name} src={userDataLogged.picture} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="h6" align="center">
                {' '}
                {userDataLogged.name}
              </Typography>
            }
          />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon>
            <CalendarMonthIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="Fecha de ingreso" secondary={admissionDateFormated} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon>
            <AccountCircleIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="Supervisor" secondary={userDataLogged.supervisorData.name} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary="Cliente" secondary={userDataLogged.clientData.name} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon>
            <ConstructionIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText
            primary=" N-1 Perfil:"
            secondary={userDataLogged.profiles.slice(0, 8).map((value, index) => (
              <Chip color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon></ListItemIcon>
          <ListItemText
            primary=" N-2 Conocimientos:"
            secondary={userDataLogged.knowledges.slice(0, 8).map((value, index) => (
              <Chip color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon></ListItemIcon>
          <ListItemText
            primary="  N-3 Tecnologias:"
            secondary={userDataLogged.technologies?.slice(0, 8).map((value, index) => (
              <Chip color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>
      </List>
    );
  }
};

export default UserInfo;

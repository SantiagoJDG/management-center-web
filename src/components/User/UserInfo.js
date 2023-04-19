import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Box
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
      <List data-testid="user-info-component" dense sx={{ padding: 1.5 }}>
        <ListItem disablePadding sx={{ mb: 3, padding: 0.5 }}>
          <ListItemIcon>
            <Avatar alt={userDataLogged.name} src={userDataLogged.picture} />
          </ListItemIcon>
          <ListItemText
            component="span"
            primary={
              <Typography variant="h6" align="center">
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
          <ListItemText primary="Supervisor" secondary={userDataLogged.supervisorData?.name} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary="Cliente" secondary={userDataLogged.clientData?.name} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemIcon>
            <ConstructionIcon color="info" fontSize="large" />
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

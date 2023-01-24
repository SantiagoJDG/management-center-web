import { Avatar, Box, Chip, List, ListItem, ListItemText, Typography } from '@mui/material';
import moment from 'moment';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged }) => {
  const admissionDateFormated = moment(userDataLogged.admissionDate).format('LL');
  if (!userDataLogged) {
    return 'There is no user Data';
  } else {
    return (
      <List dense sx={{ padding: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}>
          <Avatar alt={userDataLogged.name} src={userDataLogged.picture} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" align="center">
            {' '}
            {userDataLogged.name}
          </Typography>
        </Box>

        <ListItem disablePadding>
          <ListItemText primary="Fecha de ingreso" secondary={admissionDateFormated} />
        </ListItem>

        <ListItem disablePadding>
          <ListItemText primary="Supervisor" secondary={userDataLogged.supervisorData.name} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText primary="Cliente" secondary={userDataLogged.clientData.name} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText
            primary=" N-1 Perfil:"
            secondary={userDataLogged.profiles.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText
            primary=" N-2 Conocimientos:"
            secondary={userDataLogged.knowledges.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemText
            primary="  N-3 Tecnologias:"
            secondary={userDataLogged.technologies?.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          />
        </ListItem>
      </List>
    );
  }
};

export default UserInfo;

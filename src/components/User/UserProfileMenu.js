import { Avatar, Chip, ListItem, ListItemText, Typography, ListItemIcon, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';

import moment from 'moment';
import 'moment/locale/es';

const UserProfileMenu = ({ userDataLogged }) => {
  const admissionDateFormated = moment(userDataLogged.admissionDate).format('LL');
  if (!userDataLogged) {
    return 'There is no user Data';
  } else {
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <Avatar alt={userDataLogged.name} src={userDataLogged.picture} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="h7" align="center">
                {userDataLogged.name}
              </Typography>
            }
          />
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
        >
          <ListItemIcon>
            <CalendarMonthIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText
            secondary={
              <Typography variant="body2" style={{ fontSize: 12 }}>
                {admissionDateFormated}
              </Typography>
            }
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <ListItemIcon>
            <AccountCircleIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="Supervisor" secondary={userDataLogged.supervisorData?.name} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <GroupsIcon color="info" style={{ fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Cliente" secondary={userDataLogged.clientData?.name} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <ConstructionIcon color="info" fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="N-1 Perfil" />
          <ListItemText
            component="div"
            primary={userDataLogged.profilesData?.slice(0, 8).map((value, index) => (
              <Chip sx={{ margin: 0.2 }} color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary=" N-2 Conocimientos:" />
          <ListItemText
            component="div"
            primary={userDataLogged.knowledges?.slice(0, 8).map((value, index) => (
              <Chip sx={{ margin: 0.2 }} color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary=" N-3 Tecnologias:" />
          <ListItemText
            component="div"
            primary={userDataLogged.technologies?.slice(0, 8).map((value, index) => (
              <Chip sx={{ margin: 0.2 }} color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>
      </Box>
    );
  }
};

export default UserProfileMenu;

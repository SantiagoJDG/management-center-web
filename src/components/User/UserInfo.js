import { Chip, List, ListItem, ListItemText, Typography, ListItemIcon } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged }) => {
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
          <ListItemIcon>
            <CalendarMonthIcon
              color="white"
              fontSize="large"
              style={{ fontSize: 40, color: 'white' }}
            />
          </ListItemIcon>
          <ListItemText
            secondary={<Typography variant="body2" style={{ fontSize: 12 }}></Typography>}
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <ListItemIcon>
            <AccountCircleIcon
              data-testid="mock-icon"
              color="aliceblue"
              fontSize="large"
              style={{ fontSize: 40, color: 'white' }}
            />
          </ListItemIcon>
          <ListItemText primary="" secondary={userDataLogged.supervisorData?.name} />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <GroupsIcon color="aliceblue" style={{ fontSize: 40, color: 'white' }} />
          </ListItemIcon>
          <ListItemText />
        </ListItem>
        <br></br>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon>
            <ConstructionIcon
              color="aliceblue"
              fontSize="large"
              style={{ fontSize: 40, color: 'white' }}
            />
          </ListItemIcon>
          <ListItemText />
          <ListItemText
            component="div"
            primary={userDataLogged.profilesData?.slice(0, 8).map((value, index) => (
              <Chip sx={{ margin: 0.2 }} color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon></ListItemIcon>
          <ListItemText />
          <ListItemText
            component="div"
            primary={userDataLogged.knowledges?.slice(0, 8).map((value, index) => (
              <Chip
                sx={{ margin: 0.2 }}
                color="default"
                size="small"
                key={index}
                label={value.name}
              />
            ))}
          />
        </ListItem>

        <ListItem disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon></ListItemIcon>
          <ListItemText />
          <ListItemText
            component="div"
            primary={userDataLogged.technologies?.slice(0, 8).map((value, index) => (
              <Chip sx={{ margin: 0.2 }} color="info" size="small" key={index} label={value.name} />
            ))}
          />
        </ListItem>
      </List>
    );
  }
};

export default UserInfo;

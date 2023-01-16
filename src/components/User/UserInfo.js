import { Box, Chip, Grid, Avatar, Typography } from '@mui/material';
import moment from 'moment';
import 'moment/locale/es';

const UserInfo = ({ userDataLogged, profilePicture }) => {
  const admissionDateFormated = moment(userDataLogged.admissionDate).format('LL');
  if (!userDataLogged) {
    return 'There is no user Data';
  } else {
    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" gap={1}>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}>
            <Avatar alt={userDataLogged.name} src={profilePicture} />
          </Box>
          <Typography variant="h4" align="center">
            {userDataLogged.name}
          </Typography>
        </Grid>
        <Grid item>{admissionDateFormated}</Grid>
        <Grid item>{userDataLogged.supervisor.name}</Grid>
        <Grid item>{userDataLogged.client.name}</Grid>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}>
            <Typography variant="h7" align="center">
              N-1 Perfil:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {userDataLogged.profiles.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}>
            <Typography variant="h7" align="center">
              N-2 Conocimientos:
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {userDataLogged.knowledges.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0.5 }}>
            <Typography variant="h7" align="center">
              N-2 Tecnologias:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {userDataLogged.technologies.slice(0, 8).map((value, index) => (
              <Chip key={index} label={value.name} />
            ))}
          </Box>
        </Grid>
      </Grid>
    );
  }
};

export default UserInfo;

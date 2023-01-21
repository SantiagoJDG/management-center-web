import { Avatar, Box, Card, CardActionArea, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const UserProfile = ({ userDataLogged }) => {
  const { internalRoles, name, picture } = userDataLogged;

  const router = useRouter();

  const storeUserRoleProfile = (profile) => {
    localStorage.setItem('user', { profile: JSON.stringify(profile) });

    router.push('/');
  };

  const profileSelection = (profile) => {
    return (
      <Card>
        <CardActionArea
          sx={{ display: 'flex', padding: 1, border: 'solid', justifyContent: 'flex-start' }}
          onClick={() => {
            storeUserRoleProfile(profile);
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <Avatar alt={name} src={picture} />
          </Box>
          <Box sx={{ justifyContent: 'start', padding: 0.5 }}>
            <Typography variant="h5" align="center" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="h7">{profile}</Typography>
          </Box>
        </CardActionArea>
      </Card>
    );
  };

  if (!userDataLogged) {
    return 'No User Logged';
  } else {
    return (
      <Grid container direction="column" justifyContent="flex-start" gap={1}>
        <Typography variant="h5" align="start" fontWeight="bold">
          Quiero ingresar como
        </Typography>
        {internalRoles.map((role, index) => {
          return (
            <Grid key={index} item>
              {profileSelection(role.name)}
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default UserProfile;

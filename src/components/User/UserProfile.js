import { useState, useEffect } from 'react';
import { Grid, Box, Avatar, Typography, Card, CardActionArea } from '@mui/material';

const UserProfile = ({ userDataLogged, profilePicture }) => {
  const [roleProfile, setRoleProfile] = useState('');
  const { roles, name } = userDataLogged;

  useEffect(() => {
    localStorage.setItem('user', { profile: JSON.stringify(roleProfile) });
  }, [roleProfile]);

  const storeUserRoleProfile = (profile) => {
    setRoleProfile(profile);
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
            <Avatar alt={name} src={profilePicture} />
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
        {roles.map((role, index) => {
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

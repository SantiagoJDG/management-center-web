import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

import UserProfile from 'components/User/UserProfile';

const UserInfoPage = () => {
  const { userToken, waitingUser, userData } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }
  }, [userToken, waitingUser]);

  const render = () => {
    if (userData) {
      return (
        <Grid container spacing={2} direction="row">
          <Grid item sx={{ display: 'flex', alignItems: 'center' }} xs={12} md={10} lg={6} xl={4}>
            <UserProfile userDataLogged={userData} />
          </Grid>
        </Grid>
      );
    } else {
      return <h3>no data</h3>;
    }
  };

  return render();
};

export default UserInfoPage;

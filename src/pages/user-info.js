import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';
import { getAxiosInstance } from '../utils/axiosClient';
import { Grid } from '@mui/material';

import UserInfo from 'components/User/UserInfo';
import UserProfile from 'components/User/UserProfile';

const UserInfoPage = () => {
  const { userToken, waitingUser, userData } = useAuth();
  const [collaboratorData, setCollaboratorData] = useState();

  const router = useRouter();
  const {
    query: { id }
  } = router;

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) return;

    const userId = id ? id : userData.consultecId;
    if (userId) {
      getCollaboratorData(userId);
    }
  }, [userToken, waitingUser, id, userData]);

  const getCollaboratorData = async (id) => {
    try {
      let path = `/api/collaborator/${id}`;
      await getAxiosInstance()
        .get(path)
        .then((response) => {
          setCollaboratorData(response.data);
        });
    } catch (error) {
      console.error('Error while get Collaborator..', error);
    }
  };
  const render = () => {
    if (collaboratorData) {
      return (
        <Grid container spacing={2} direction="row">
          <Grid item alignContent={'start'}>
            <UserInfo userDataLogged={collaboratorData} profilePicture={userData.picture} />
          </Grid>
          <Grid item sx={{ display: 'flex', alignItems: 'center' }} xs={4}>
            <UserProfile userDataLogged={collaboratorData} profilePicture={userData.picture} />
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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, CardHeader, Avatar, IconButton, CardContent } from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';
import EditableCollaborator from '../components/Collaborators/EditableCollaborator';
import CollaboratorInformation from '../components/Collaborators/CollaboratorInformation';

const Collaborator = () => {
  const router = useRouter();
  const {
    query: { id, edit }
  } = router;

  const { userToken, waitingUser, getUserData } = useAuth();
  const [collaboratorData, setCollaboratorData] = useState();

  const getCollaboratorData = async (id) => {
    try {
      let path = `/api/collaborator/${id}`;
      let response = await getAxiosInstance().get(path);
      setCollaboratorData(response.data);
    } catch (error) {
      console.error('Error while get Collaborator..', error);
    }
  };

  const getInformationView = () => {
    if (collaboratorData && !edit) {
      return <CollaboratorInformation collaboratorData={collaboratorData} />;
    } else {
      return <EditableCollaborator />;
    }
  };

  const showInformation = () => {
    if (userToken) {
      return (
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    EG
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title="Edgar Alexander Guevara Naranjo"
                subheader="Ingreso 15 de Julio 2015"
              />
              <CardContent>{getInformationView()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else {
      return 'There is not collaborator';
    }
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) return;

    if (id) {
      getCollaboratorData(id);
    }
  }, [id, waitingUser, userToken]);

  return showInformation();
};

export default Collaborator;

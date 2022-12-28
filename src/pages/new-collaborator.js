import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, CardHeader, Avatar, IconButton, CardContent } from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import 'moment/locale/es';

import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';
import EditableCollaborator from '../components/Collaborators/EditableCollaborator';
import CollaboratorInformation from '../components/Collaborators/CollaboratorInformation';

const Collaborator = () => {
  const { userToken, waitingUser, userData } = useAuth();
  const [collaboratorData, setCollaboratorData] = useState();

  var admissionDateFormated = moment().format('LL');
  var PrincipalName = 'Nuevo consultor';

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
    return <EditableCollaborator />;
  };

  const showInformation = () => {
    if (userToken) {
      return (
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    alt={userData.name}
                  ></Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={PrincipalName}
                subheader={`Fecha de ingreso: ${admissionDateFormated}`}
              />
              <CardContent>{getInformationView()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else {
      return 'There is loading page';
    }
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) return;
  }, [userToken, waitingUser, userData]);

  return showInformation();
};

export default Collaborator;

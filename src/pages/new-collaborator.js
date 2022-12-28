import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Card, CardContent, CardHeader, Grid, IconButton } from '@mui/material';
import { red } from '@mui/material/colors';
import moment from 'moment';
import 'moment/locale/es';
import { useEffect } from 'react';

import EditableCollaborator from '../components/Collaborators/EditableCollaborator';
import useAuth from '../hooks/useAuth';

const Collaborator = () => {
  const { userToken, waitingUser, userData } = useAuth();

  var admissionDateFormated = moment().format('LL');
  var PrincipalName = 'Nuevo consultor';

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

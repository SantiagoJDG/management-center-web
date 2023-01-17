import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import 'moment/locale/es';

import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';
import EditableCollaborator from '../components/Collaborators/EditableCollaborator';
import CollaboratorInformation from '../components/Collaborators/CollaboratorInformation';

const Collaborator = () => {
  const router = useRouter();
  const {
    query: { id, edit }
  } = router;

  const { userToken, waitingUser, userData } = useAuth();
  const [collaboratorData, setCollaboratorData] = useState();
  const [pricipalInformation, setPricipalInformation] = useState({
    name: '',
    admissionDate: ''
  });

  const getCollaboratorData = async (id) => {
    try {
      let path = `/api/collaborator/${id}`;
      let response = await getAxiosInstance().get(path);
      setPricipalInformation({
        name: response.data.name,
        admissionDate: moment(response.data.admission_date).format('LL')
      });
      setCollaboratorData(response.data);
    } catch (error) {
      console.error('Error while get Collaborator..', error);
    }
  };

  const getInformationView = () => {
    if (collaboratorData && edit === 'true') {
      return (
        <EditableCollaborator
          collaboratorData={collaboratorData}
          setPrincipalInformation={setPricipalInformation}
        />
      );
    }
    if (collaboratorData && (!edit || edit === 'false')) {
      return <CollaboratorInformation collaboratorData={collaboratorData} />;
    }
  };

  const showInformation = () => {
    if (userToken && collaboratorData) {
      return (
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    alt={pricipalInformation.name}
                  ></Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={pricipalInformation.name}
                subheader={
                  pricipalInformation.admissionDate &&
                  `Fecha de ingreso: ${pricipalInformation.admissionDate}`
                }
              />
              <CardContent>{getInformationView()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) return;

    const userId = id ? id : userData.consultecId;
    if (userId) {
      getCollaboratorData(userId);
    }
  }, [userToken, waitingUser, id, userData]);

  return showInformation();
};

export default Collaborator;

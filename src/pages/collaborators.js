import { Backdrop, CircularProgress, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAxiosInstance } from '../utils/axiosClient';

import CollaboratorBarFilter from 'components/Collaborators/CollaboratorBarFilter';
import CollaboratorSliderFilter from 'components/Collaborators/CollaboratorSliderFilter';
import CollaboratorTable from 'components/Collaborators/CollaboratorTable';
import DateBarFilter from 'components/Collaborators/DateBarFilter';
import useAuth from 'hooks/useAuth';

const Collaborators = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState(null);
  const [AllCollaborators, setAllCollaborators] = useState(null);
  const [searchValueName, setSearchValueName] = useState('');
  const [searchValueCode, setSearchValueCode] = useState('');

  const router = useRouter();

  const getCollaborators = async () => {
    try {
      let collaboratorPath = '/api/collaborator';
      await getAxiosInstance()
        .get(collaboratorPath)
        .then((collaboratorsResponse) => {
          setTimeout(() => {
            setCollaborators(collaboratorsResponse.data);
            setAllCollaborators(collaboratorsResponse.data);
          }, 5000);
        });
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const onSearchNameValueChange = (event) => {
    setSearchValueName(event.target.value);
    setCollaborators(filterByName(event.target.value, event.target.name));
  };

  const onSearchCodeValueChange = (event) => {
    setSearchValueCode(event.target.value);
    setCollaborators(filterByName(event.target.value, event.target.name));
  };

  const filterByName = (searchValue, nameValue) => {
    if (searchValue.length < 1 || searchValue === '') {
      return AllCollaborators;
    } else {
      return collaborators.filter((collaborator) => {
        const collaboratorLowerCase = collaborator[nameValue].toLowerCase();
        const searchTextLowerCase = searchValue.toLowerCase();
        return collaboratorLowerCase.includes(searchTextLowerCase);
      });
    }
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }

    getCollaborators();
  }, [userToken, waitingUser]);

  return collaborators ? (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={2}>
          <TextField
            id="name"
            name="name"
            label="Filtrar por nombre"
            variant="standard"
            value={searchValueName}
            onChange={onSearchNameValueChange}
            size="small"
          />
        </Grid>

        <Grid item xs={6} md={4} lg={2}>
          <TextField
            id="internalCode"
            name="internalCode"
            label="Filtrar por codigo"
            variant="standard"
            value={searchValueCode}
            onChange={onSearchCodeValueChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <DateBarFilter
            allCollaborators={AllCollaborators}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          ></DateBarFilter>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <CollaboratorSliderFilter
            allCollaborators={AllCollaborators}
            setCollaborators={setCollaborators}
          ></CollaboratorSliderFilter>
        </Grid>

        <Grid item xs={12}>
          <CollaboratorBarFilter setCollaborators={setCollaborators} />
        </Grid>

        <Grid item xs={12}>
          <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Collaborators;

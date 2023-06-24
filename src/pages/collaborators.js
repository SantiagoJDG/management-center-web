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
          setCollaborators(collaboratorsResponse.data);
          setAllCollaborators(collaboratorsResponse.data);
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
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={12} container style={{ backgroundColor: 'white', padding: '16px' }}>
        <Grid item xs={1}>
          <TextField
            id="name"
            name="name"
            label="Filtrar nombre"
            variant="standard"
            value={searchValueName}
            onChange={onSearchNameValueChange}
            size="small"
            style={{ marginRight: '8px' }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            id="internalCode"
            name="internalCode"
            label="Filtrar codigo"
            variant="standard"
            value={searchValueCode}
            onChange={onSearchCodeValueChange}
            size="small"
          />
        </Grid>

        <Grid item xs={6}>
          <DateBarFilter
            allCollaborators={AllCollaborators}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          ></DateBarFilter>
        </Grid>

        <Grid item xs={3}>
          <CollaboratorSliderFilter
            allCollaborators={AllCollaborators}
            setCollaborators={setCollaborators}
          ></CollaboratorSliderFilter>
        </Grid>
      </Grid>

      <Grid item xs={12} spacing={1} style={{ backgroundColor: 'white', padding: '10px' }}>
        <CollaboratorBarFilter setCollaborators={setCollaborators} />
      </Grid>

      <Grid item xs={12}>
        <br></br>
        <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
      </Grid>
    </Grid>
  ) : (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Collaborators;

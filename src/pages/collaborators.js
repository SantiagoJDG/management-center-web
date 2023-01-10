import { Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getAxiosInstance } from '../utils/axiosClient';

import CollaboratorBarFilter from 'components/Collaborators/CollaboratorBarFilter';
import CollaboratorSliderFilter from 'components/Collaborators/CollaboratorSliderFilter';
import CollaboratorTable from 'components/Collaborators/CollaboratorTable';
import DateBarFilter from 'components/Collaborators/DateBarFilter';

const Collaborators = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [AllCollaborators, setAllCollaborators] = useState([]);
  const [searchValueName, setSearchValueName] = useState('');
  const [searchValueCode, setSearchValueCode] = useState('');

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
    setCollaborators(filterByName(searchValueName, AllCollaborators));
  };

  const filterByName = (searchValue, filteredCollaborators) => {
    if (!searchValue.length >= 1 || searchValue === '') {
      return AllCollaborators;
    } else {
      return filteredCollaborators.filter((collaborator) => {
        const collaboratorLowerCase = collaborator.name.toLowerCase();
        const searchTextLowerCase = searchValue.toLowerCase();
        return collaboratorLowerCase.includes(searchTextLowerCase);
      });
    }
  };

  const onSearchCodeValueChange = (event) => {
    setSearchValueCode(event.target.value);
    setCollaborators(filterByCode(searchValueCode, AllCollaborators));
  };

  const filterByCode = (searchValue, filteredCollaborators) => {
    if (!searchValue.length >= 1 || searchValue === ' ' || searchValue === '') {
      return AllCollaborators;
    } else {
      return filteredCollaborators.filter((collaborator) => {
        return collaborator.code.includes(searchValue);
      });
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [userToken, waitingUser]);

  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={2}>
          <TextField
            id="standard-basic"
            label="Filtrar por nombre"
            variant="standard"
            value={searchValueName}
            onChange={onSearchNameValueChange}
            size="small"
          />
        </Grid>

        <Grid item xs={6} md={4} lg={2}>
          <TextField
            id="standard-basic"
            label="Filtrar por codigo"
            variant="standard"
            value={searchValueCode}
            onChange={onSearchCodeValueChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <DateBarFilter
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            allCollaborators={AllCollaborators}
          ></DateBarFilter>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <CollaboratorSliderFilter
            setCollaborators={setCollaborators}
            allCollaborators={AllCollaborators}
          ></CollaboratorSliderFilter>
        </Grid>

        <Grid item xs={12}>
          <CollaboratorBarFilter
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            allCollaborators={AllCollaborators}
          />
        </Grid>

        <Grid item xs={12}>
          <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Collaborators;

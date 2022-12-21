import { useState, useEffect } from 'react';
import React from 'react';
import { Grid, Box, TextField } from '@mui/material';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

import CollaboratorTable from 'components/Collaborators/CollaboratorTable';
import CollaboratorBarFilter from 'components/Collaborators/CollaboratorBarFilter';

const Collaborators = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [AllCollaborators, setAllCollaborators] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getCollaborators = async () => {
    try {
      let response = await getAxiosInstance().get('/api/collaborator');
      setCollaborators(response.data);
      setAllCollaborators(response.data);
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
    setCollaborators(filterByName(searchValue, AllCollaborators));
  };

  const filterByName = (searchValue, filteredCollaborators) => {
    console.log(searchValue);
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

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [userToken, waitingUser]);

  return (
    <>
      <Grid container direction={'column'} spacing={2}>
        <Grid item rowSpacing={100} sx={{ display: 'flex' }}>
          <Box sx={{ padding: 2 }}>
            <TextField
              id="filled-basic"
              label="Name"
              value={searchValue}
              onChange={onSearchValueChange}
            />
          </Box>
          <CollaboratorBarFilter
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            allCollaborators={AllCollaborators}
          />
        </Grid>
        <Grid item>
          <Box sx={{ width: '70vw', height: '70vh' }}>
            <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Collaborators;

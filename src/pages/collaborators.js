import { useState, useEffect } from 'react';
import React from 'react';
import { Grid, Box, TextField } from '@mui/material';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

import CollaboratorFilter from 'components/Collaborators/CollaboratorFilter';
import CollaboratorTable from 'components/Collaborators/CollaboratorTable';

const Collaborators = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownItem, setItem] = React.useState([]);
  const countries = ['Argentina', 'Venezuela', 'Panamá', 'Espana', 'France'];
  let searchedCollaborators = [];

  const getCollaborators = async () => {
    try {
      let response = await getAxiosInstance().get('/api/collaborator');
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [waitingUser, userToken]);

  if (!searchValue.length >= 1 && !dropdownItem >= 1) {
    searchedCollaborators = collaborators;
  } else {
    searchedCollaborators = collaborators.filter((collaborator) => {
      const collaboratorLowerCase = collaborator.name.toLowerCase();
      const searchTextLowerCase = searchValue.toLowerCase();
      return (
        collaboratorLowerCase.includes(searchTextLowerCase) &&
        collaborator.residency.includes(dropdownItem)
      );
    });
  }

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
          <Box sx={({ bgcolor: 'white' }, { padding: 2 })}>
            <CollaboratorFilter
              item={dropdownItem}
              setItem={setItem}
              title={'Paises'}
              dropdownData={countries}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ width: '70vw', height: '70vh' }}>
            <CollaboratorTable collaborators={searchedCollaborators}></CollaboratorTable>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Collaborators;

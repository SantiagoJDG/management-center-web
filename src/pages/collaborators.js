import { useState, useEffect } from 'react';
import React from 'react';
import { Grid, Box, TextField } from '@mui/material';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

import CollaboratorTable from 'components/Collaborators/CollaboratorTable';
import CollaboratorBarFilter from 'components/Collaborators/CollaboratorBarFilter';
import DateBarFilter from 'components/Collaborators/DateBarFilter';

const Collaborators = () => {
  const { userToken, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [AllCollaborators, setAllCollaborators] = useState([]);
  const [searchValue, setSearchValue] = useState('');

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

  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
    setCollaborators(filterByName(searchValue, AllCollaborators));
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

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [userToken, waitingUser]);

  return (
    <>
      <Grid container spacing={{ xs: 1, md: 2 }} sx={{ gap: 1 }}>
        <Grid
          item
          sx={{
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box>
            <TextField
              id="standard-basic"
              label="Filtrar por nombre"
              variant="standard"
              value={searchValue}
              onChange={onSearchValueChange}
              size="small"
            />
          </Box>
        </Grid>
        <Grid
          item
          sx={{
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box xl={6} lg={5} md={5} sm={1.5} xs={1}>
            <DateBarFilter
              collaborators={collaborators}
              setCollaborators={setCollaborators}
              allCollaborators={AllCollaborators}
            ></DateBarFilter>
          </Box>
        </Grid>
        <Grid item xs={6} md={10} lg={20} xl={25}>
          <CollaboratorBarFilter
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            allCollaborators={AllCollaborators}
          />
        </Grid>
        <Grid item sx={{ flexWrap: 'wrap' }}>
          <Box xl={2} lg={2} md={2} sm={1.5}>
            <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Collaborators;

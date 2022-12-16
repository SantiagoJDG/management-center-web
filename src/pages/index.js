import { useState, useEffect } from 'react';
import React from 'react';
import { Box, Container } from '@mui/material';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

import CollaboratorFilter from 'components/CollaboratorFilter/CollaboratorFilter';
import CollaboratorTable from 'components/CollaboratorTable/CollaboratorTable';
import CollaboratorSearch from 'components/CollaboratorSearch/CollaboratorSearch';

export default function Home() {
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

  useEffect(() => {
    if (!userToken) return;

    getCollaborators();
  }, [waitingUser]);

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
    <React.Fragment>
      <CollaboratorSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Container maxWidth="lm" sx={{ display: 'flex' }}>
        <Box sx={{ bgcolor: '#cfe8fc', width: '70vw', height: '70vh' }}>
          <CollaboratorTable
            collaborators={searchedCollaborators}
          ></CollaboratorTable>
        </Box>
        <Box sx={{ bgcolor: 'white', width: '30vw', height: '70vh' }}>
          <CollaboratorFilter
            item={dropdownItem}
            setItem={setItem}
            title={'Paises'}
            dropdownData={countries}
          />
        </Box>
      </Container>
    </React.Fragment>
  );
}

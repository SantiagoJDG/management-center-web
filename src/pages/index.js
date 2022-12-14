import { useState, useEffect } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

import CollaboratorFilter from 'components/CollaboratorFilter/CollaboratorFilter';
import CollaboratorTable from 'components/CollaboratorTable/CollaboratorTable';
import CollaboratorSearch from 'components/CollaboratorSearch/CollaboratorSearch';

export default function Home() {
  const { userToken, getUserData, waitingUser } = useAuth();
  const [collaborators, setCollaborators] = useState([]);

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

  return (
    <React.Fragment>
      <CollaboratorSearch></CollaboratorSearch>
      <Container maxWidth="lm" sx={{ display: 'flex' }}>
        <Box sx={{ bgcolor: '#cfe8fc', width: '70vw', height: '70vh' }}>
          <CollaboratorTable collaborators={collaborators}></CollaboratorTable>
        </Box>
        <Box sx={{ bgcolor: '#006400', width: '30vw', height: '70vh' }}>
          <CollaboratorFilter></CollaboratorFilter>
        </Box>
      </Container>
    </React.Fragment>
  );
}

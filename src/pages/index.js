
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import CollaboratorFilter from 'components/CollaboratorFilter/CollaboratorFilter';
import CollaboratorTable from 'components/CollaboratorTable/CollaboratorTable';
import CollaboratorSearch from 'components/CollaboratorSearch/CollaboratorSearch'


export default function Home() {

  return (
    <React.Fragment>
      <CollaboratorSearch></CollaboratorSearch>
      <Container maxWidth="lm" sx={{ display: 'flex', }}>
        <Box sx={{ bgcolor: '#cfe8fc', width: '70vw', height: '70vh' }}>
          <CollaboratorTable></CollaboratorTable>
        </Box>
        <Box sx={{ bgcolor: '#006400', width: '30vw', height: '70vh' }}>
          <CollaboratorFilter></CollaboratorFilter>
        </Box>
      </Container>
    </React.Fragment>
  );
}

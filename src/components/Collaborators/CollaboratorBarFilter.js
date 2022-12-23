import React from 'react';
import CollaboratorFilter from './CollaboratorFilter';
import { Grid } from '@mui/material';

const countries = ['Argentina', 'Venezuela', 'Panamá', 'Espana', 'France'];
const officeCountries = ['Argentina', 'Venezuela', 'Panamá', 'Espana', 'France'];

export const CollaboratorBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  const filteredCollaborator = (collaborators, value, collaboratorKey) => {
    if (!value.length) return collaborators;
    return allCollaborators.filter((filteredCollaborator) => {
      return value.includes(filteredCollaborator[collaboratorKey]);
    });
  };

  const executeFilter = (value, collaboratorKey) => {
    setCollaborators(filteredCollaborator(allCollaborators, [...value], collaboratorKey));
  };
  return (
    !!collaborators && (
      <>
        <Grid container sx={{ display: 'row', width: '100%' }}>
          <Grid item sx={{ width: '33.3%', paddingRight: 1, paddingLeft: 1 }}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={countries}
              filterData={executeFilter}
              collaboratorKey={'residency'}
            />
          </Grid>
          <Grid item sx={{ width: '33.3%', paddingRight: 1 }}>
            <CollaboratorFilter
              title={'Oficina'}
              dropdownData={officeCountries}
              filterData={executeFilter}
              collaboratorKey={'office'}
            />
          </Grid>
          <Grid item sx={{ width: '33.3%', paddingRight: 1 }}>
            <CollaboratorFilter
              title={'Otro Filtro'}
              dropdownData={officeCountries}
              filterData={executeFilter}
              collaboratorKey={'office'}
            />
          </Grid>
        </Grid>
      </>
    )
  );
};

export default CollaboratorBarFilter;

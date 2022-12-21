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
    setCollaborators((p) =>
      filteredCollaborator(allCollaborators, [...p, ...value], collaboratorKey)
    );
  };
  return (
    !!collaborators && (
      <>
        <Grid container sx={{ display: 'row' }}>
          <Grid item sx={{ padding: 2 }}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={countries}
              filterData={executeFilter}
              collaboratorKey={'residency'}
            />
          </Grid>
          <Grid item sx={{ padding: 2 }}>
            <CollaboratorFilter
              title={'Oficina'}
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

import React from 'react';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getAxiosInstance } from '../../utils/axiosClient';
import { Grid } from '@mui/material';

import CollaboratorFilter from './CollaboratorFilter';

export const CollaboratorBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  const { userToken, waitingUser } = useAuth();
  const [residencies, setResidencies] = useState([]);
  const [cities, setCities] = useState([]);
  const [office, setOffice] = useState([]);
  const [contractType, setContractType] = useState([]);
  const [knowledge, setKnowledge] = useState([]);

  const filteredCollaborator = (collaborators, value, collaboratorKey) => {
    if (!value.length) return collaborators;
    return allCollaborators.filter((filteredCollaborator) => {
      return value.includes(filteredCollaborator[collaboratorKey]);
    });
  };

  const executeFilter = (value, collaboratorKey) => {
    setCollaborators(filteredCollaborator(allCollaborators, [...value], collaboratorKey));
  };

  const getResidencies = async () => {
    try {
      let residenciesResponse = await getAxiosInstance().get('/api/residencies');
      let knowledgeResponse = await getAxiosInstance().get('/api/knowledge');
      const countries = [];
      const states = [];
      const officeContract = [];
      const contract_type = [];
      const knowledge_list = [];
      createFilterArray(residenciesResponse.data, 'country', countries);
      createFilterArray(residenciesResponse.data, 'state', states);
      createFilterArray(residenciesResponse.data, 'office', officeContract);
      createFilterArray(residenciesResponse.data, 'contract_type', contract_type);
      createFilterArray(knowledgeResponse.data, 'knowledge', knowledge_list);
      setKnowledge(knowledge_list);
      setCities(states);
      setOffice(officeContract);
      setContractType(contract_type);
      return setResidencies(countries);
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  const createFilterArray = (response, key, emptyArray) => {
    response.forEach((object) => {
      emptyArray.push(object[key]);
      return emptyArray;
    });
  };

  useEffect(() => {
    if (!userToken) return;

    getResidencies();
  }, [userToken, waitingUser]);

  return (
    !!collaborators && (
      <>
        <Grid container sx={{ flexWrap: 'wrap' }}>
          <Grid sx={{ paddingRight: 1, paddingLeft: 1 }} xl={2} lg={1.5} md={1} sm={1} xs={1}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={residencies}
              filterData={executeFilter}
              collaboratorKey={'residency'}
            />
          </Grid>
          <Grid sx={{ paddingRight: 1 }} xl={2} lg={1.5} md={1} sm={1} xs={1}>
            <CollaboratorFilter
              title={'City'}
              dropdownData={cities}
              filterData={executeFilter}
              collaboratorKey={'state'}
            />
          </Grid>
          <Grid sx={{ paddingRight: 1 }} xl={2} lg={1.5} md={1} sm={1} xs={1}>
            <CollaboratorFilter
              title={'Office'}
              dropdownData={office}
              filterData={executeFilter}
              collaboratorKey={'state'}
            />
          </Grid>
          <Grid sx={{ paddingRight: 1 }} xl={2} lg={1.5} md={1} sm={1} xs={1}>
            <CollaboratorFilter
              title={'Contrato'}
              dropdownData={contractType}
              filterData={executeFilter}
              collaboratorKey={'contract_type'}
            />
          </Grid>
          <Grid sx={{ paddingRight: 1 }} xl={2} lg={1.5} md={1} sm={1} xs={1}>
            <CollaboratorFilter
              title={'N1'}
              dropdownData={knowledge}
              filterData={executeFilter}
              collaboratorKey={'knowledge'}
            />
          </Grid>
        </Grid>
      </>
    )
  );
};

export default CollaboratorBarFilter;

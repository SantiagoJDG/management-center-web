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
      const countries = [];
      const states = [];
      const officeContract = [];
      const contract_type = [];
      const knowledge_list = [];

      let residenciesPath = '/api/residence';
      await getAxiosInstance()
        .get(residenciesPath)
        .then((residence) => {
          createFilterArray(residence.data, 'office', officeContract);
          createFilterArray(residence.data, 'contract_type', contract_type);
        });

      let statePath = '/api/residence/states';
      await getAxiosInstance()
        .get(statePath)
        .then((statesResponse) => {
          createFilterArray(statesResponse.data, 'name', states);
        });

      let countriesPath = '/api/residence/countries';
      await getAxiosInstance()
        .get(countriesPath)
        .then((countriesResponse) => {
          createFilterArray(countriesResponse.data, 'name', countries);
        });

      let knowledgePath = '/api/operation/knowledges';
      await getAxiosInstance()
        .get(knowledgePath)
        .then((knowledge) => {
          createFilterArray(knowledge.data, 'name', knowledge_list);
        });
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
        <Grid container sx={{ gap: 1 }}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={residencies}
              filterData={executeFilter}
              collaboratorKey={'residency'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <CollaboratorFilter
              title={'City'}
              dropdownData={cities}
              filterData={executeFilter}
              collaboratorKey={'state'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <CollaboratorFilter
              title={'Office'}
              dropdownData={office}
              filterData={executeFilter}
              collaboratorKey={'office'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <CollaboratorFilter
              title={'Contrato'}
              dropdownData={contractType}
              filterData={executeFilter}
              collaboratorKey={'contract_type'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
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

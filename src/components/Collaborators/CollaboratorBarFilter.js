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
  const [knowledge, setKnowledge] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [clients, setClients] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

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
      let statePath = '/api/residence/states';
      await getAxiosInstance()
        .get(statePath)
        .then((statesResponse) => {
          setCities(statesResponse.data);
        });

      let countriesPath = '/api/residence/countries';
      await getAxiosInstance()
        .get(countriesPath)
        .then((countriesResponse) => {
          setResidencies(countriesResponse.data);
        });

      let officePath = '/api/hiring/offices';
      await getAxiosInstance()
        .get(officePath)
        .then((officeResponse) => {
          setOffice(officeResponse.data);
        });

      let knowledgePath = '/api/operation/knowledges';
      await getAxiosInstance()
        .get(knowledgePath)
        .then((knowledge) => {
          setKnowledge(knowledge.data);
        });

      let technologiesPath = '/api/operation/technologies';
      await getAxiosInstance()
        .get(technologiesPath)
        .then((tech) => {
          setTechnologies(tech.data);
        });

      let clientsPath = '/api/operation/clients';
      await getAxiosInstance()
        .get(clientsPath)
        .then((client) => {
          setClients(client.data);
        });

      let supervisorsPath = '/api/operation/supervisors';
      await getAxiosInstance()
        .get(supervisorsPath)
        .then((supervisor) => {
          setSupervisors(supervisor.data);
        });
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getResidencies();
  }, [userToken, waitingUser]);

  return (
    !!collaborators && (
      <>
        <Grid container sx={{ gap: 1 }}>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={residencies}
              filterData={executeFilter}
              collaboratorKey={'residencyid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'Ciudad'}
              dropdownData={cities}
              filterData={executeFilter}
              collaboratorKey={'stateid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'Oficina'}
              dropdownData={office}
              filterData={executeFilter}
              collaboratorKey={'officeid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'N1'}
              dropdownData={knowledge}
              filterData={executeFilter}
              collaboratorKey={'knowledgeid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'N2'}
              dropdownData={technologies}
              filterData={executeFilter}
              collaboratorKey={'knowledgeid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'Supervisor'}
              dropdownData={supervisors}
              filterData={executeFilter}
              collaboratorKey={'supervisorid'}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={1.5} xl={1}>
            <CollaboratorFilter
              title={'Cliente'}
              dropdownData={clients}
              filterData={executeFilter}
              collaboratorKey={'clientid'}
            />
          </Grid>
        </Grid>
      </>
    )
  );
};

export default CollaboratorBarFilter;

import React from 'react';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getAxiosInstance } from '../../utils/axiosClient';
import { Grid } from '@mui/material';

import CollaboratorFilter from './CollaboratorFilter';

export const CollaboratorBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  console.log(allCollaborators);
  const { userToken, waitingUser } = useAuth();
  const [residencies, setResidencies] = useState([]);
  const [cities, setCities] = useState([]);
  const [office, setOffice] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [clients, setClients] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [profile, setProfile] = useState([]);
  const [filters, setFilters] = useState({});

  const filteredCollaborator = async (collaborators, filters) => {
    try {
      let statePath = '/api/collaborator/filterBy';
      return await getAxiosInstance()
        .get(statePath, { params: filters })
        .then((rows) => {
          return rows.data;
        });
    } catch {
      console.log('error catched');
    }
  };

  const executeFilter = (value, collaboratorKey) => {
    const filtersAdd = {
      [collaboratorKey]: value
    };
    setFilters((previousState) => {
      if (!Object.keys(previousState).length) return filtersAdd;
      return {
        ...previousState,
        ...filtersAdd
      };
    });
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

      let profilePath = '/api/operation/profiles';
      await getAxiosInstance()
        .get(profilePath)
        .then((profile) => {
          setProfile(profile.data);
        });
    } catch (error) {
      console.error('Error while get Collaborators..', error);
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getResidencies();
  }, [userToken, waitingUser]);

  useEffect(() => {
    filteredCollaborator(allCollaborators, filters).then((response) => {
      return setCollaborators(response);
    });
  }, [filters, setCollaborators, allCollaborators]);

  return (
    !!collaborators && (
      <Grid container spacing={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CollaboratorFilter
              title={'Paises'}
              dropdownData={residencies}
              filterData={executeFilter}
              collaboratorKey={'countryData'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CollaboratorFilter
              title={'Ciudad'}
              dropdownData={cities}
              filterData={executeFilter}
              collaboratorKey={'stateData'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'Oficina'}
              dropdownData={office}
              filterData={executeFilter}
              collaboratorKey={'office'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'Supervisor'}
              dropdownData={supervisors}
              filterData={executeFilter}
              collaboratorKey={'supervisor'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'Cliente'}
              dropdownData={clients}
              filterData={executeFilter}
              collaboratorKey={'client'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'N1'}
              dropdownData={profile}
              filterData={executeFilter}
              collaboratorKey={'profiles'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'N2'}
              dropdownData={knowledge}
              filterData={executeFilter}
              collaboratorKey={'knowledges'}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CollaboratorFilter
              title={'N3'}
              dropdownData={technologies}
              filterData={executeFilter}
              collaboratorKey={'technologies'}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  );
};

export default CollaboratorBarFilter;

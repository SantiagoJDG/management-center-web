import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

import useMessage from 'hooks/useMessage';
import CustomFilterDropdown from '../CustomFilterDropdown';

export const CollaboratorBarFilter = ({ setCollaborators }) => {
  const { handleNewMessage } = useMessage();

  const [residencies, setResidencies] = useState([]);
  const [cities, setCities] = useState([]);
  const [office, setOffice] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [clients, setClients] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [profile, setProfile] = useState([]);
  const [filters, setFilters] = useState({});

  const filteredCollaborator = async (filters) => {
    getAxiosInstance()
      .get('/api/collaborator/filterBy', { params: filters })
      .then((response) => {
        setCollaborators(response.data);
      })
      .catch((error) => {
        console.error('Error while get data of filtered collaborators', error);

        handleNewMessage({
          text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
          severity: 'error'
        });
      });
  };

  const executeFilter = (value, collaboratorKey) => {
    const filtersAdd = {
      [collaboratorKey]: value
    };

    let filtersToUse = filtersAdd;

    if (Object.keys(filters).length) {
      filtersToUse = {
        ...filters,
        ...filtersAdd
      };
    }

    setFilters(filtersToUse);

    filteredCollaborator(filtersToUse);
  };

  const getDataInformation = (path, callbackMethod) => {
    getAxiosInstance()
      .get(path)
      .then((response) => {
        callbackMethod(response.data);
      })
      .catch((error) => {
        console.error(`Error while get data from ${path}`, error);
      });
  };

  const getDataToFilters = () => {
    getDataInformation('/api/residence/states', setCities);

    getDataInformation('/api/residence/countries', setResidencies);

    getDataInformation('/api/hiring/offices', setOffice);

    getDataInformation('/api/operation/knowledges', setKnowledge);

    getDataInformation('/api/operation/technologies', setTechnologies);

    getDataInformation('/api/operation/clients', setClients);

    getDataInformation('/api/operation/supervisors', setSupervisors);

    getDataInformation('/api/operation/profiles', setProfile);
  };

  useEffect(() => {
    getDataToFilters();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'Paises'}
          dropdownData={residencies}
          filterData={executeFilter}
          collaboratorKey={'countryData'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'Ciudad'}
          dropdownData={cities}
          filterData={executeFilter}
          collaboratorKey={'stateData'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'Oficina'}
          dropdownData={office}
          filterData={executeFilter}
          collaboratorKey={'office'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'Supervisor'}
          dropdownData={supervisors}
          filterData={executeFilter}
          collaboratorKey={'supervisor'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'Cliente'}
          dropdownData={clients}
          filterData={executeFilter}
          collaboratorKey={'client'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'N1'}
          dropdownData={profile}
          filterData={executeFilter}
          collaboratorKey={'profiles'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'N2'}
          dropdownData={knowledge}
          filterData={executeFilter}
          collaboratorKey={'knowledges'}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomFilterDropdown
          title={'N3'}
          dropdownData={technologies}
          filterData={executeFilter}
          collaboratorKey={'technologies'}
        />
      </Grid>
    </Grid>
  );
};

export default CollaboratorBarFilter;

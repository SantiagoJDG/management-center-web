import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Button
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import 'moment/locale/es';
import Collaborator from 'pages/collaborator';
import { useEffect, useState } from 'react';

import CustomAutoComplete from '../../components/CustomAutoComplete';
import { getAxiosInstance } from '../../utils/axiosClient';

const EditableCollaborator = ({ collaboratorData }) => {
  const [newCollaborator, setNewCollaborator] = useState({});
  const [admissionDate, setAdmissionDate] = useState(moment().format());
  const [relativeDateFromAdmission, setRelativeDateFromAdmission] = useState(moment().fromNow());

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [offices, setOffices] = useState([]);
  const [types, setTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [managements, setManagements] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [clients, setClients] = useState([]);

  const [roles, setRoles] = useState([]);
  const [seniorities, setSeniorities] = useState([]);
  const [readinessList, setReadinessList] = useState([]);
  const [internalRoles, setInternalRoles] = useState([]);

  const getResidenceData = async () => {
    try {
      let countriesPath = '/api/residence/countries';
      getAxiosInstance()
        .get(countriesPath)
        .then((countriesResponse) => {
          setCountries(countriesResponse.data);
        });

      let statesPath = '/api/residence/states';
      await getAxiosInstance()
        .get(statesPath)
        .then((statesResponse) => {
          setStates(statesResponse.data);
        });
    } catch (error) {
      console.error('Error while get Residence Data..', error);
    }
  };

  const getHiringData = async () => {
    try {
      let officesPath = '/api/hiring/offices';
      let officesResponse = await getAxiosInstance().get(officesPath);
      setOffices(officesResponse.data);

      let typesPath = '/api/hiring/types';
      let typesResponse = await getAxiosInstance().get(typesPath);
      setTypes(typesResponse.data);

      let companiesPath = '/api/hiring/companies';
      let companiesResponse = await getAxiosInstance().get(companiesPath);
      setCompanies(companiesResponse.data);

      let statusPath = '/api/hiring/status';
      let statusResponse = await getAxiosInstance().get(statusPath);
      setStatusList(statusResponse.data);
    } catch (error) {
      console.error('Error while get Hiring Data..', error);
    }
  };

  const getOperationData = async () => {
    try {
      let managementsPath = '/api/operation/managements';
      let managementsResponse = await getAxiosInstance().get(managementsPath);
      setManagements(managementsResponse.data);

      let supervisorsPath = '/api/operation/supervisors';
      let supervisorsResponse = await getAxiosInstance().get(supervisorsPath);
      setSupervisors(supervisorsResponse.data);

      let profilesPath = '/api/operation/profiles';
      let profilesResponse = await getAxiosInstance().get(profilesPath);
      setProfiles(profilesResponse.data);

      let knowledgesPath = '/api/operation/knowledges';
      let knowledgesResponse = await getAxiosInstance().get(knowledgesPath);
      setKnowledges(knowledgesResponse.data);

      let technologiesPath = '/api/operation/technologies';
      let technologiesResponse = await getAxiosInstance().get(technologiesPath);
      setTechnologies(technologiesResponse.data);

      let clientsPath = '/api/operation/clients';
      let clientsResponse = await getAxiosInstance().get(clientsPath);
      setClients(clientsResponse.data);
    } catch (error) {
      console.error('Error while get Operation Data..', error);
    }
  };

  const getConsultecIdentityData = async () => {
    try {
      let rolesPath = '/api/consultec-identity/roles';
      let rolesResponse = await getAxiosInstance().get(rolesPath);
      setRoles(rolesResponse.data);

      let senioritiesPath = '/api/consultec-identity/seniorities';
      let senioritiesResponse = await getAxiosInstance().get(senioritiesPath);
      setSeniorities(senioritiesResponse.data);

      let readinessPath = '/api/consultec-identity/readiness';
      let readinessResponse = await getAxiosInstance().get(readinessPath);
      setReadinessList(readinessResponse.data);

      let internalRolesPath = '/api/consultec-identity/internal-roles';
      let internalRolesResponse = await getAxiosInstance().get(internalRolesPath);
      setInternalRoles(internalRolesResponse.data);
    } catch (error) {
      console.error('Error while get consultec identity..', error);
    }
  };

  async function saveNewItem(paths, newItem, setNewList, oldList) {
    try {
      let createdItem = await getAxiosInstance().post(paths, newItem);
      console.log(createdItem);
      return createdItem.data.id;
    } catch (error) {
      console.error('Error while save new item...', error);
    }
  }

  async function handleCountry(country) {
    if (!country) return;
    if (!country.id) {
      let idReturned = await saveNewItem('/api/residence/countries', country);
      country.id = idReturned;
      setCountries([...countries, country]);
    }
    setNewCollaborator({ ...newCollaborator, country: country.id });
  }

  async function handleState(state) {
    if (!state) return;
    if (!state.id) {
      let idReturned = await saveNewItem('/api/residence/states', state);
      state.id = idReturned;
      setStates([...states, state]);
    }
    setNewCollaborator({ ...newCollaborator, state: state.id });
  }

  async function handleCompany(company) {
    if (!company) return;
    if (!company.id) {
      let idReturned = await saveNewItem('/api/hiring/companies', company);
      company.id = idReturned;
      setCompanies([...companies, company]);
    }
    setNewCollaborator({ ...newCollaborator, company: company.id });
  }

  async function handleOffice(office) {
    if (!office) return;
    if (!office.id) {
      let idReturned = await saveNewItem('/api/hiring/offices', office);
      office.id = idReturned;
      setOffices([...offices, office]);
    }
    setNewCollaborator({ ...newCollaborator, company: office.id });
  }

  async function handleStatus(status) {
    if (!status) return;
    if (!status.id) {
      let idReturned = await saveNewItem('/api/hiring/status', status);
      status.id = idReturned;
      setStatusList([...statusList, status]);
    }
    setNewCollaborator({ ...newCollaborator, status: status.id });
  }

  async function handleType(type) {
    if (!type) return;
    if (!type.id) {
      let idReturned = await saveNewItem('/api/hiring/types', type);
      type.id = idReturned;
      setTypes([...types, type]);
    }
    setNewCollaborator({ ...newCollaborator, type: type.id });
  }

  async function handleManagement(management) {
    if (!management) return;
    if (!management.id) {
      let idReturned = await saveNewItem('/api/operation/managements', management);
      management.id = idReturned;
      setManagements([...managements, management]);
    }
    setNewCollaborator({ ...newCollaborator, management: management.id });
  }

  async function handleClient(client) {
    if (!client) return;
    if (!client.id) {
      let idReturned = await saveNewItem('/api/operation/clients', client);
      client.id = idReturned;
      setClients([...clients, client]);
    }
    setNewCollaborator({ ...newCollaborator, client: client.id });
  }

  async function handleRole(role) {
    if (!role) return;
    if (!role.id) {
      let idReturned = await saveNewItem('/api/consultec-identity/roles', role);
      role.id = idReturned;
      setRoles([...roles, role]);
    }
    setNewCollaborator({ ...newCollaborator, role: role.id });
  }

  async function handleSeniority(seniority) {
    if (!seniority) return;
    if (!seniority.id) {
      let idReturned = await saveNewItem('/api/consultec-identity/seniorities', seniority);
      seniority.id = idReturned;
      setSeniorities([...seniorities, seniority]);
    }
    setNewCollaborator({ ...newCollaborator, seniority: seniority.id });
  }

  async function handleReadiness(readiness) {
    if (!readiness) return;
    if (!readiness.id) {
      let idReturned = await saveNewItem('/api/consultec-identity/readiness', readiness);
      readiness.id = idReturned;
      setReadinessList([...readinessList, readiness]);
    }
    setNewCollaborator({ ...newCollaborator, readiness: readiness.id });
  }

  async function handleInternalRole(internalRole) {
    if (!internalRole) return;
    if (!internalRole.id) {
      let idReturned = await saveNewItem('/api/consultec-identity/readiness', internalRole);
      internalRole.id = idReturned;
      setInternalRoles([...internalRoles, internalRole]);
    }
    setNewCollaborator({ ...newCollaborator, internalRole: internalRole.id });
  }

  const handleAdmissionDateChange = (newValue) => {
    setAdmissionDate(newValue);
  };

  const showInformation = () => {
    return (
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="personal-information-content"
            id="personal-information-header"
          >
            <h2>Información de identidad personal</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6} lg={2}>
                    <TextField
                      size="small"
                      required
                      id="outlined-required"
                      label="Código consultor"
                      defaultValue={collaboratorData && collaboratorData.internal_code}
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Nombres y Apellidos"
                      defaultValue={collaboratorData && collaboratorData.name}
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Email corporativo"
                      defaultValue={collaboratorData && collaboratorData.email}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <MobileDatePicker
                        fullWidth
                        label="Fecha de ingreso"
                        inputFormat="DD/MM/YYYY"
                        value={admissionDate}
                        onChange={handleAdmissionDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={9} lg={4}>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-required"
                      label="Antigüedad"
                      InputProps={{
                        readOnly: true
                      }}
                      value={relativeDateFromAdmission}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      name="country"
                      label="País de residencia"
                      optionList={countries}
                      elmentCallback={handleCountry}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      name="state"
                      label="Ciudad de residencia"
                      optionList={states}
                      elmentCallback={handleState}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="contract-information-content"
            id="contract-information-header"
          >
            <h2>Información de contrato</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4}>
                    <CustomAutoComplete
                      name="company"
                      label="Empresa contratante"
                      optionList={companies}
                      elmentCallback={handleCompany}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <CustomAutoComplete
                      name="office"
                      label="Oficina de contrato"
                      optionList={offices}
                      elmentCallback={handleOffice}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <CustomAutoComplete
                      name="status"
                      label="Estado"
                      optionList={statusList}
                      elmentCallback={handleStatus}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      name="type"
                      label="Tipo de contrato"
                      optionList={types}
                      elmentCallback={handleType}
                    />
                  </Grid>

                  <Grid item xs={10} lg={4}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Tarifa mensual bruta"
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="operations-information-content"
            id="operations-information-header"
          >
            <h2>Información de operaciones</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <CustomAutoComplete
                      name="management"
                      label="Dirección"
                      optionList={managements}
                      elmentCallback={handleManagement}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="supervisor"
                      size="small"
                      options={supervisors}
                      getOptionLabel={(supervisor) => supervisor.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Supervidor" />}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <CustomAutoComplete
                      name="client"
                      label="Cliente"
                      optionList={clients}
                      elmentCallback={handleClient}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="n1Profile"
                      options={profiles}
                      getOptionLabel={(profile) => profile.name}
                      renderInput={(params) => <TextField {...params} label="N1-Perfil" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="n2Knowledge"
                      options={knowledges}
                      getOptionLabel={(knowledge) => knowledge.name}
                      filterSelectedOptions
                      renderInput={(params) => <TextField {...params} label="N2-Especialidad" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="n3Technology"
                      options={technologies}
                      getOptionLabel={(technology) => technology.name}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} label="N3-tecnologías predominantes" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="consultec-identity-content"
            id="consultec-identity-header"
          >
            <h2>Información de identidad consultec</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4}>
                    <CustomAutoComplete
                      name="role"
                      label="Rol"
                      optionList={roles}
                      elmentCallback={handleRole}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <CustomAutoComplete
                      name="seniority"
                      label="Seniority"
                      optionList={seniorities}
                      elmentCallback={handleSeniority}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <CustomAutoComplete
                      name="readiness"
                      label="Readiness"
                      optionList={readinessList}
                      elmentCallback={handleReadiness}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Firma de correo"
                      defaultValue={collaboratorData && collaboratorData.email_signature}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      name="internalRole"
                      label="Rol dentro del sistema"
                      optionList={internalRoles}
                      elmentCallback={handleInternalRole}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Button
          variant="contained"
          onClick={() => {
            console.log(newCollaborator);
          }}
        >
          Guardar
        </Button>
      </Box>
    );
  };

  useEffect(() => {
    getResidenceData();
    getHiringData();
    getOperationData();
    getConsultecIdentityData();

    if (collaboratorData) {
      setAdmissionDate(moment(collaboratorData.admission_date).format());
      setRelativeDateFromAdmission(moment(collaboratorData.admission_date).fromNow());
    }
  }, [collaboratorData]);

  return showInformation();
};

export default EditableCollaborator;

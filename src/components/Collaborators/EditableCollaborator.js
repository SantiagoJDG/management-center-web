import moment from 'moment';
import 'moment/locale/es';
import { useState, useEffect } from 'react';
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
  createFilterOptions
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { getAxiosInstance } from '../../utils/axiosClient';
import CustomAutoComplete from '../../components/CustomAutoComplete';

const EditableCollaborator = ({ collaboratorData }) => {
  const [admissionDate, setAdmissionDate] = useState(moment().format());
  const [relativeDateFromAdmission, setRelativeDateFromAdmission] = useState(moment().fromNow());

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [offices, setOffices] = useState([]);
  const [types, setTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState([]);

  const [managements, setManagements] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [clients, setClients] = useState([]);

  const [roles, setRoles] = useState([]);
  const [seniorities, setSeniorities] = useState([]);
  const [readiness, setReadiness] = useState([]);
  const [internalRoles, setInternalRoles] = useState([]);

  const filter = createFilterOptions();

  const getResidenceData = async () => {
    try {
      let countriesPath = '/api/residence/countries';
      let countriesResponse = await getAxiosInstance().get(countriesPath);
      setCountries(countriesResponse.data);

      let statesPath = '/api/residence/states';
      let statesResponse = await getAxiosInstance().get(statesPath);
      setStates(statesResponse.data);
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
      setStatus(statusResponse.data);
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
      setReadiness(readinessResponse.data);

      let internalRolesPath = '/api/consultec-identity/internal-roles';
      let internalRolesResponse = await getAxiosInstance().get(internalRolesPath);
      setInternalRoles(internalRolesResponse.data);
    } catch (error) {
      console.error('Error while get consultec identity..', error);
    }
  };

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
                    <CustomAutoComplete optionList={countries} />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={states}
                      getOptionLabel={(state) => state.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Ciudad de residencia" />
                      )}
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={companies}
                      getOptionLabel={(company) => company.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Empresa contratante" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={offices}
                      getOptionLabel={(office) => office.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Oficina de contrato" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={status}
                      getOptionLabel={(status) => status.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Estado" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={types}
                      getOptionLabel={(type) => type.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Tipo de contrato" />}
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={managements}
                      getOptionLabel={(management) => management.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Dirección" />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={supervisors}
                      getOptionLabel={(supervisor) => supervisor.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Supervidor" />}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={clients}
                      getOptionLabel={(client) => client.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Cliente" />}
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
                      id="tags-outlined"
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
                      id="tags-outlined"
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
                      id="tags-outlined"
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={roles}
                      getOptionLabel={(role) => role.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Rol" />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={seniorities}
                      getOptionLabel={(seniority) => seniority.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Seniority" />}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={readiness}
                      getOptionLabel={(readiness) => readiness.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Readiness" />}
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={internalRoles}
                      getOptionLabel={(internalRole) => internalRole.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Rol dentro del sistema" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>
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

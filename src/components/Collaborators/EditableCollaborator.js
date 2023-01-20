import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  TextField
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import 'moment/locale/es';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Joi from 'joi';
import CustomAutoComplete from '../../components/CustomAutoComplete';
import { getAxiosInstance } from '../../utils/axiosClient';
import { Router } from 'next/router';

const CollaboratorSchema = Joi.object({
  internalCode: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  country: Joi.number().required(),
  state: Joi.number().required(),
  company: Joi.number().required(),
  office: Joi.number().required(),
  status: Joi.number().required(),
  contractType: Joi.number().required(),
  salaryAmount: Joi.number().required().precision(4),
  management: Joi.number().required(),
  supervisor: Joi.number().required(),
  client: Joi.number().required(),
  profiles: Joi.array().required(),
  knowledges: Joi.array().required(),
  technologies: Joi.array().required(),
  role: Joi.number().required(),
  seniority: Joi.any(),
  readiness: Joi.any(),
  emailSignature: Joi.string().required(),
  internalRole: Joi.number().required(),
  admissionDate: Joi.any()
});

const EditableCollaborator = ({ collaboratorData, setPrincipalInformation }) => {
  const [formErrors, setFormErrors] = useState({});
  const [newCollaborator, setNewCollaborator] = useState({
    internalCode: '',
    name: '',
    email: '',
    country: null,
    state: null,
    company: null,
    status: null,
    contractType: null,
    salaryAmount: '',
    management: null,
    client: null,
    profiles: null,
    knowledges: null,
    technologies: null,
    role: null,
    seniority: null,
    readiness: null,
    emailSignature: '',
    internalRole: null,
    admissionDate: moment().format('YYYY-MM-DD')
  });
  const [initialDataCollaborator, setInitialDataCollaborator] = useState({});

  const [admissionDate, setAdmissionDate] = useState(moment().format());
  const [relativeDateFromAdmission, setRelativeDateFromAdmission] = useState(moment().fromNow());

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [offices, setOffices] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
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

  const router = useRouter();

  const getDataInformation = (path, callbackMethod) => {
    getAxiosInstance()
      .get(path)
      .then((response) => {
        callbackMethod(response.data);
      })
      .catch((error) => {
        console.error(`Error while get Data from ${path}`, error);
      });
  };

  const getResidenceData = async () => {
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/residence/states', setStates);
  };

  const getHiringData = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/hiring/types', setContractTypes);
    getDataInformation('/api/hiring/companies', setCompanies);
    getDataInformation('/api/hiring/status', setStatusList);
  };

  const getOperationData = async () => {
    getDataInformation('/api/operation/managements', setManagements);
    getDataInformation('/api/operation/supervisors', setSupervisors);
    getDataInformation('/api/operation/profiles', setProfiles);
    getDataInformation('/api/operation/knowledges', setKnowledges);
    getDataInformation('/api/operation/technologies', setTechnologies);
    getDataInformation('/api/operation/clients', setClients);
  };

  const getConsultecIdentityData = async () => {
    getDataInformation('/api/consultec-identity/roles', setRoles);
    getDataInformation('/api/consultec-identity/seniorities', setSeniorities);
    getDataInformation('/api/consultec-identity/readiness', setReadinessList);
    getDataInformation('/api/consultec-identity/internal-roles', setInternalRoles);
  };

  async function saveNewItem(paths, newItem) {
    try {
      let createdItem = await getAxiosInstance().post(paths, newItem);
      return createdItem.data.id;
    } catch (error) {
      console.error('Error while save new item...', error);
    }
  }

  async function saveCollaborator(collaboratorToSave) {
    try {
      let modifiedCollaborator;

      if (collaboratorData) {
        modifiedCollaborator = await getAxiosInstance().put(
          `/api/collaborator/${collaboratorData.id}`,
          collaboratorToSave
        );
      } else {
        modifiedCollaborator = await getAxiosInstance().post(
          '/api/collaborator/',
          collaboratorToSave
        );
      }
      return modifiedCollaborator.data.id;
    } catch (error) {
      console.error('Error while save new Collaborator...', error);
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
    setNewCollaborator({ ...newCollaborator, office: office.id });
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

  async function handleContractTypes(contractType) {
    if (!contractType) return;
    if (!contractType.id) {
      let idReturned = await saveNewItem('/api/hiring/types', contractTypes);
      contractType.id = idReturned;
      setContractTypes([...contractTypes, contractType]);
    }
    setNewCollaborator({ ...newCollaborator, contractType: contractType.id });
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

  async function handleSupervisor(supervisor) {
    if (!supervisor) return;
    setNewCollaborator({ ...newCollaborator, supervisor: supervisor.id });
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

  async function handleProfiles(_profiles) {
    if (!_profiles) return;

    let actualProfiles = newCollaborator.profiles ? [...newCollaborator.profiles] : [];

    const newProfiles = _profiles.map((profile, index) => {
      if (profile.inputValue) {
        const profileCreatedBefore = actualProfiles.find(
          (item) => item.name === profile.inputValue
        );
        if (!profileCreatedBefore) {
          saveNewItem('/api/operation/profiles', profile).then((idReturned) => {
            newProfiles[index] = {
              id: idReturned,
              name: profile.inputValue
            };

            setNewCollaborator({ ...newCollaborator, profiles: newProfiles });
            setProfiles([...profiles, newProfiles[index]]);
          });
          return {
            name: profile.inputValue
          };
        }
        return profileCreatedBefore;
      }
      return profile;
    });

    setNewCollaborator({ ...newCollaborator, profiles: [...newProfiles] });
  }

  async function handleKnowledges(_knowledges) {
    if (!_knowledges) return;

    let actualKnowledges = newCollaborator.knowledges ? [...newCollaborator.knowledges] : [];

    const newKnowledges = _knowledges.map((knowledge, index) => {
      if (knowledge.inputValue) {
        const knowledgeCreatedBefore = actualKnowledges.find(
          (item) => item.name === knowledge.inputValue
        );
        if (!knowledgeCreatedBefore) {
          saveNewItem('/api/operation/knowledges', knowledge).then((idReturned) => {
            newKnowledges[index] = {
              id: idReturned,
              name: knowledge.inputValue
            };

            setNewCollaborator({ ...newCollaborator, knowledges: newKnowledges });
            setKnowledges([...knowledges, newKnowledges[index]]);
          });
          return {
            name: knowledge.inputValue
          };
        }
        return knowledgeCreatedBefore;
      }
      return knowledge;
    });

    setNewCollaborator({ ...newCollaborator, knowledges: [...newKnowledges] });
  }

  async function handleTechnologies(_technologies) {
    if (!_technologies) return;

    let actualTechnologies = newCollaborator.technologies ? [...newCollaborator.technologies] : [];

    const newTechnologies = _technologies.map((technology, index) => {
      if (technology.inputValue) {
        const technologyCreatedBefore = actualTechnologies.find(
          (item) => item.name === technology.inputValue
        );
        if (!technologyCreatedBefore) {
          saveNewItem('/api/operation/technologies', technology).then((idReturned) => {
            newTechnologies[index] = {
              id: idReturned,
              name: technology.inputValue
            };

            setNewCollaborator({ ...newCollaborator, technologies: newTechnologies });
            setKnowledges([...technologies, newTechnologies[index]]);
          });
          return {
            name: technology.inputValue
          };
        }
        return technologyCreatedBefore;
      }
      return technology;
    });

    setNewCollaborator({ ...newCollaborator, technologies: [...newTechnologies] });
  }

  function handleTextChange(event) {
    if (!event.target.value) {
      setFormErrors({ ...formErrors, [event.target.name]: true });
    } else {
      setFormErrors({ ...formErrors, [event.target.name]: false });
    }
    setNewCollaborator({ ...newCollaborator, [event.target.name]: event.target.value });
    setPrincipalInformation({ ...newCollaborator, [event.target.name]: event.target.value });
  }

  function handleAdmissionDateChange(newValue) {
    setAdmissionDate(newValue.format('YYYY-MM-DD'));
    setNewCollaborator({ ...newCollaborator, admissionDate: newValue.format('YYYY-MM-DD') });

    const monthOfRelativeDate = moment().month(newValue.month()).fromNow(true);
    const yearOfRelativeDate = moment(newValue).fromNow();
    setRelativeDateFromAdmission(`${yearOfRelativeDate} y ${monthOfRelativeDate}`);
  }

  function handleSaveCollaborator() {
    const { error } = CollaboratorSchema.validate(newCollaborator, { abortEarly: false });
    if (error) {
      console.log(error);
      let newErrors = {};
      error.details.map((detail) => {
        newErrors[detail.path] = true;
      });
      setFormErrors(newErrors);

      return;
    }
    saveCollaborator(newCollaborator);
    router.push({
      pathname: '/collaborators'
    });
  }

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
                      error={formErrors.internalCode}
                      size="small"
                      id="internalCode"
                      name="internalCode"
                      label="Código consultor"
                      value={newCollaborator.internalCode}
                      onChange={handleTextChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      error={formErrors.name}
                      id="name"
                      name="name"
                      label="Nombres y Apellidos"
                      value={newCollaborator.name}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      error={formErrors.email}
                      id="email"
                      name="email"
                      label="Email corporativo"
                      value={newCollaborator.email}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
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
                        label="Fecha de ingreso"
                        inputFormat="DD/MM/YYYY"
                        value={admissionDate}
                        onChange={handleAdmissionDateChange}
                        renderInput={(params) => <TextField {...params} required />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={9} lg={4}>
                    <TextField
                      size="small"
                      fullWidth
                      id="antiquity"
                      name="antiquity"
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
                      showError={formErrors.country}
                      name="country"
                      label="País de residencia"
                      optionList={countries}
                      elmentCallback={handleCountry}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.country}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      showError={formErrors.state}
                      name="state"
                      label="Ciudad de residencia"
                      optionList={states}
                      elmentCallback={handleState}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.state}
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
                      showError={formErrors.company}
                      name="company"
                      label="Empresa contratante"
                      optionList={companies}
                      elmentCallback={handleCompany}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.company}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <CustomAutoComplete
                      showError={formErrors.office}
                      name="office"
                      label="Oficina de contrato"
                      optionList={offices}
                      elmentCallback={handleOffice}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.office}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <CustomAutoComplete
                      showError={formErrors.status}
                      name="status"
                      label="Estado"
                      optionList={statusList}
                      elmentCallback={handleStatus}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.status}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      showError={formErrors.contractType}
                      name="contractType"
                      label="Tipo de contrato"
                      optionList={contractTypes}
                      elmentCallback={handleContractTypes}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.contractType}
                    />
                  </Grid>

                  <Grid item xs={10} lg={4}>
                    <TextField
                      error={formErrors.salaryAmount}
                      id="salaryAmount"
                      name="salaryAmount"
                      label="Tarifa mensual bruta"
                      value={newCollaborator.salaryAmount}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
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
                      showError={formErrors.management}
                      name="management"
                      label="Dirección"
                      optionList={managements}
                      elmentCallback={handleManagement}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.management}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <CustomAutoComplete
                      showError={formErrors.supervisor}
                      name="supervisor"
                      label="Supervisor"
                      optionList={supervisors}
                      elmentCallback={handleSupervisor}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.supervisor}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <CustomAutoComplete
                      showError={formErrors.client}
                      name="client"
                      label="Cliente"
                      optionList={clients}
                      elmentCallback={handleClient}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.client}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomAutoComplete
                      showError={formErrors.profiles}
                      name="n1Profile"
                      label="N1-Perfil"
                      optionList={profiles}
                      elmentCallback={handleProfiles}
                      multiple={true}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.profiles}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomAutoComplete
                      showError={formErrors.knowledges}
                      name="n2Knowledge"
                      label="N2-Especialidad"
                      optionList={knowledges}
                      elmentCallback={handleKnowledges}
                      multiple={true}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.knowledges}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomAutoComplete
                      showError={formErrors.technologies}
                      name="n3Technology"
                      label="N3-tecnologías predominantes"
                      optionList={technologies}
                      elmentCallback={handleTechnologies}
                      multiple={true}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.technologies}
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
                      showError={formErrors.role}
                      name="role"
                      label="Rol"
                      optionList={roles}
                      elmentCallback={handleRole}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.role}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <CustomAutoComplete
                      name="seniority"
                      label="Seniority"
                      optionList={seniorities}
                      elmentCallback={handleSeniority}
                      prechargedValue={initialDataCollaborator.seniority}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <CustomAutoComplete
                      name="readiness"
                      label="Readiness"
                      optionList={readinessList}
                      elmentCallback={handleReadiness}
                      prechargedValue={initialDataCollaborator.readiness}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <TextField
                      error={formErrors.emailSignature}
                      id="emailSignature"
                      name="emailSignature"
                      label="Firma de correo"
                      value={newCollaborator.emailSignature}
                      onChange={handleTextChange}
                      size="small"
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      showError={formErrors.internalRole}
                      name="internalRole"
                      label="Rol dentro del sistema"
                      optionList={internalRoles}
                      elmentCallback={handleInternalRole}
                      requiredField={true}
                      prechargedValue={initialDataCollaborator.internalRole}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Button variant="contained" onClick={handleSaveCollaborator}>
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
      setAdmissionDate(moment(collaboratorData.admissionDate).format());
      setRelativeDateFromAdmission(moment(collaboratorData.admissionDate).fromNow());
      const salaryAmount =
        collaboratorData.salaries && collaboratorData.salaries.length > 0
          ? collaboratorData.salaries[0].amount
          : 0;

      setNewCollaborator({
        internalCode: collaboratorData.internalCode,
        name: collaboratorData.name,
        emailSignature: collaboratorData.emailSignature,
        email: collaboratorData.email,
        country: collaboratorData.residencyData.countryData.id,
        state: collaboratorData.residencyData.stateData.id,
        supervisor: collaboratorData.supervisorData.id,
        admissionDate: moment(collaboratorData.admissionDate).format('YYYY-MM-DD'),
        company: collaboratorData.companyData.id,
        office: collaboratorData.officeData.id,
        status: collaboratorData.statusData.id,
        contractType: collaboratorData.contractTypeData.id,
        salaryAmount: salaryAmount,
        management: collaboratorData.managementData.id,
        client: collaboratorData.clientData.id,
        profiles: collaboratorData.profiles,
        knowledges: collaboratorData.knowledges,
        technologies: collaboratorData.technologies,
        role: collaboratorData.identityRoleData.id,
        seniority: collaboratorData.seniorityData.id,
        readiness: collaboratorData.readinessData.id
      });

      setInitialDataCollaborator({
        internalCode: collaboratorData.internalCode,
        name: collaboratorData.name,
        emailSignature: collaboratorData.emailSignature,
        email: collaboratorData.email,
        country: collaboratorData.residencyData.countryData,
        state: collaboratorData.residencyData.stateData,
        supervisor: collaboratorData.supervisorData,
        admissionDate: moment(collaboratorData.admissionDate).format('YYYY-MM-DD'),
        company: collaboratorData.companyData,
        office: collaboratorData.officeData,
        status: collaboratorData.statusData,
        contractType: collaboratorData.contractTypeData,
        salaryAmount: salaryAmount,
        management: collaboratorData.managementData,
        client: collaboratorData.clientData,
        profiles: collaboratorData.profiles,
        knowledges: collaboratorData.knowledges,
        technologies: collaboratorData.technologies,
        role: collaboratorData.identityRoleData,
        seniority: collaboratorData.seniorityData,
        readiness: collaboratorData.readinessData,
        internalRole: collaboratorData.internalRoleData
      });
    }
  }, [collaboratorData]);

  return showInformation();
};

export default EditableCollaborator;

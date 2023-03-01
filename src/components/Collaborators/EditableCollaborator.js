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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Joi from 'joi';

import useMessage from 'hooks/useMessage';
import { getAxiosInstance } from 'utils/axiosClient';

import CustomAutoComplete from 'components/CustomAutoComplete';

const customMessages = {
  spanish: {
    'any.required': 'El campo es requerido',
    'array.required': 'El campo es requerido',
    'any.invalid': 'El campo tiene un valor no valido',
    'any.empty': 'El campo es requerido',
    'array.empty': 'El campo es requerido',
    'string.empty': 'El campo es requerido',
    'number.base': 'Debe ser un número',
    'email.invalid': 'Email no valido',
    'string.email': 'El campo debe ser un correo electrónico válido'
  }
};

const CollaboratorSchema = Joi.object({
  internalCode: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  country: Joi.any().required(),
  state: Joi.any().required(),
  company: Joi.any().required(),
  office: Joi.any().required(),
  status: Joi.any().required(),
  contractType: Joi.any().required(),
  salaryAmount: Joi.number().required().precision(4),
  management: Joi.any().required(),
  supervisor: Joi.any().required(),
  client: Joi.any().required(),
  profiles: Joi.array().required(),
  knowledges: Joi.array().required(),
  technologies: Joi.array().required(),
  role: Joi.any().required(),
  seniority: Joi.any(),
  readiness: Joi.any(),
  emailSignature: Joi.string().required(),
  internalRoles: Joi.array().required(),
  admissionDate: Joi.any()
});

const EditableCollaborator = ({ collaboratorData, setPrincipalInformation }) => {
  const { handleNewMessage } = useMessage();

  const [formErrors, setFormErrors] = useState({});
  const [newCollaborator, setNewCollaborator] = useState({
    internalCode: '',
    name: '',
    email: '',
    country: undefined,
    state: undefined,
    company: undefined,
    status: undefined,
    contractType: undefined,
    salaryAmount: undefined,
    management: undefined,
    client: undefined,
    profiles: undefined,
    knowledges: undefined,
    technologies: undefined,
    role: undefined,
    seniority: undefined,
    readiness: undefined,
    emailSignature: '',
    internalRoles: undefined,
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

  const preChargeStatus = (statusList) => {
    setStatusList(statusList);
    if (!collaboratorData) {
      setNewCollaborator({ ...newCollaborator, status: statusList[0].id });
    }
  };

  const getResidenceData = async () => {
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/residence/states', setStates);
  };

  const getHiringData = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/hiring/types', setContractTypes);
    getDataInformation('/api/hiring/companies', setCompanies);
    getDataInformation('/api/hiring/status', preChargeStatus);
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
      return createdItem.data;
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
      return modifiedCollaborator.data;
    } catch (error) {
      console.error('Error while save new Collaborator...', error);
    }
  }

  async function handleAutoCompleteValue(
    selectedValue,
    elementName,
    pathToSaveNew,
    callbackAfetedSaved,
    previousElements
  ) {
    if (!selectedValue) return;
    if (!selectedValue.id) {
      let idReturned = await saveNewItem(pathToSaveNew, selectedValue);
      console.log(idReturned);
      selectedValue.id = idReturned;
      console.log(idReturned);
      callbackAfetedSaved([...previousElements, selectedValue]);
    }
    console.log(elementName);
    console.log(selectedValue);
    setNewCollaborator({ ...newCollaborator, [elementName]: selectedValue.id });

    setFormErrors({ ...formErrors, [elementName]: { error: false, description: '' } });
  }

  function handleCountry(country) {
    handleAutoCompleteValue(
      country,
      'country',
      '/api/residence/countries',
      setCountries,
      countries
    );
  }

  async function handleState(state) {
    handleAutoCompleteValue(state, 'state', '/api/residence/states', setStates, states);
  }

  async function handleCompany(company) {
    handleAutoCompleteValue(company, 'company', '/api/hiring/companies', setCompanies, companies);
  }

  async function handleOffice(office) {
    handleAutoCompleteValue(office, 'office', '/api/hiring/offices', setOffices, offices);
  }

  async function handleStatus(status) {
    handleAutoCompleteValue(status, 'status', '/api/hiring/status', setStatusList, statusList);
  }

  async function handleContractTypes(contractType) {
    handleAutoCompleteValue(
      contractType,
      'contractType',
      '/api/hiring/types',
      setContractTypes,
      contractTypes
    );
  }

  async function handleManagement(management) {
    handleAutoCompleteValue(
      management,
      'management',
      '/api/operation/managements',
      setManagements,
      managements
    );
  }

  async function handleSupervisor(supervisor) {
    if (!supervisor) return;
    setNewCollaborator({ ...newCollaborator, supervisor: supervisor.id });
    setFormErrors({ ...formErrors, supervisor: { error: false, description: '' } });
  }

  async function handleClient(client) {
    handleAutoCompleteValue(client, 'client', '/api/operation/clients', setClients, clients);
  }

  async function handleAutoCompleteMultipleValues(
    _values,
    elementName,
    pathToSaveNew,
    callbackAfetedSaved,
    previousElements
  ) {
    if (!_values) return;

    let actualValues = newCollaborator[elementName] ? [...newCollaborator[elementName]] : [];

    const newValues = _values.map((value, index) => {
      if (value.inputValue) {
        const valueCreatedBefore = actualValues.find((item) => item.name === value.inputValue);
        if (!valueCreatedBefore) {
          saveNewItem(pathToSaveNew, { name: value.inputValue }).then((idReturned) => {
            newValues[index] = {
              id: idReturned,
              name: value.inputValue
            };
            callbackAfetedSaved([...previousElements, newValues[index]]);

            setNewCollaborator({ ...newCollaborator, [elementName]: newValues });
          });
          return {
            name: value.inputValue
          };
        }
        return valueCreatedBefore;
      }
      return value;
    });

    setNewCollaborator({ ...newCollaborator, [elementName]: [...newValues] });

    setFormErrors({ ...formErrors, [elementName]: { error: false, description: '' } });
  }

  function handleProfiles(_profiles) {
    handleAutoCompleteMultipleValues(
      _profiles,
      'profiles',
      '/api/operation/profiles',
      setProfiles,
      profiles
    );
  }

  function handleKnowledges(_knowledges) {
    handleAutoCompleteMultipleValues(
      _knowledges,
      'knowledges',
      '/api/operation/knowledges',
      setKnowledges,
      knowledges
    );
  }

  function handleTechnologies(_technologies) {
    handleAutoCompleteMultipleValues(
      _technologies,
      'technologies',
      '/api/operation/technologies',
      setTechnologies,
      technologies
    );
  }

  function handleRole(role) {
    handleAutoCompleteValue(role, 'role', '/api/consultec-identity/roles', setRoles, roles);
  }

  function handleSeniority(seniority) {
    handleAutoCompleteValue(
      seniority,
      'seniority',
      '/api/consultec-identity/seniorities',
      setSeniorities,
      seniorities
    );
  }

  async function handleReadiness(readiness) {
    handleAutoCompleteValue(
      readiness,
      'readiness',
      '/api/consultec-identity/readiness',
      setReadinessList,
      readinessList
    );
  }

  async function handleInternalRoles(_internalRoles) {
    handleAutoCompleteMultipleValues(
      _internalRoles,
      'internalRoles',
      '/api/operation/profiles',
      setInternalRoles,
      internalRoles
    );
  }

  function handleTextChange(event) {
    if (!event.target.value) {
      setFormErrors({
        ...formErrors,
        [event.target.name]: { error: true, description: 'El campo no puede estar vacío' }
      });
    } else {
      setFormErrors({ ...formErrors, [event.target.name]: { error: false, description: '' } });
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

  async function handleSaveCollaborator() {
    const { error } = CollaboratorSchema.validate(newCollaborator, {
      messages: customMessages,
      errors: {
        label: false,
        language: 'spanish'
      },
      abortEarly: false
    });

    if (error) {
      let newErrors = {};
      error.details.map((detail) => {
        newErrors[detail.path] = { error: true, description: detail.message };
      });

      handleNewMessage({
        text: 'Campos incompletos, favor revisar nuevamente el formulario',
        severity: 'error'
      });

      setFormErrors(newErrors);

      return;
    }
    const collaboratorId = await saveCollaborator(newCollaborator);
    if (collaboratorId > 0) {
      router.push({
        pathname: '/collaborators'
      });
    }
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
                      size="small"
                      id="internalCode"
                      name="internalCode"
                      label="Código consultor"
                      value={newCollaborator.internalCode}
                      onChange={handleTextChange}
                      required
                      error={formErrors.internalCode && formErrors.internalCode.error}
                      helperText={formErrors.internalCode && formErrors.internalCode.description}
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      id="name"
                      name="name"
                      label="Nombres y Apellidos"
                      value={newCollaborator.name}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
                      error={formErrors.name && formErrors.name.error}
                      helperText={formErrors.name && formErrors.name.description}
                    />
                  </Grid>

                  <Grid item xs={12} lg={5}>
                    <TextField
                      id="email"
                      name="email"
                      label="Email corporativo"
                      value={newCollaborator.email}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
                      error={formErrors.email && formErrors.email.error}
                      helperText={formErrors.email && formErrors.email.description}
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
                      formError={formErrors.country}
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
                      formError={formErrors.state}
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
                      formError={formErrors.company}
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
                      formError={formErrors.office}
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
                      formError={formErrors.status}
                      name="status"
                      label="Estado"
                      optionList={statusList}
                      elmentCallback={handleStatus}
                      requiredField={true}
                      prechargedValue={
                        initialDataCollaborator.status
                          ? initialDataCollaborator.status
                          : statusList[0]
                      }
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      formError={formErrors.contractType}
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
                      id="salaryAmount"
                      name="salaryAmount"
                      label="Tarifa mensual bruta"
                      value={newCollaborator.salaryAmount}
                      onChange={handleTextChange}
                      size="small"
                      fullWidth
                      required
                      error={formErrors.salaryAmount && formErrors.salaryAmount.error}
                      helperText={formErrors.salaryAmount && formErrors.salaryAmount.description}
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
                      formError={formErrors.management}
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
                      formError={formErrors.supervisor}
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
                      formError={formErrors.client}
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
                      formError={formErrors.profiles}
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
                      formError={formErrors.knowledges}
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
                      formError={formErrors.technologies}
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
                      formError={formErrors.role}
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
                      formError={formErrors.seniority}
                      name="seniority"
                      label="Seniority"
                      optionList={seniorities}
                      elmentCallback={handleSeniority}
                      prechargedValue={initialDataCollaborator.seniority}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={4}>
                    <CustomAutoComplete
                      formError={formErrors.readiness}
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
                      id="emailSignature"
                      name="emailSignature"
                      label="Firma de correo"
                      value={newCollaborator.emailSignature}
                      onChange={handleTextChange}
                      size="small"
                      required
                      fullWidth
                      error={formErrors.emailSignature && formErrors.emailSignature.error}
                      helperText={
                        formErrors.emailSignature && formErrors.emailSignature.description
                      }
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <CustomAutoComplete
                      formError={formErrors.internalRoles}
                      name="internalRole"
                      label="Rol dentro del sistema"
                      optionList={internalRoles}
                      elmentCallback={handleInternalRoles}
                      requiredField={true}
                      multiple={true}
                      prechargedValue={initialDataCollaborator.internalRoles}
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
        readiness: collaboratorData.readinessData.id,
        internalRoles: collaboratorData.internalRoles
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
        internalRoles: collaboratorData.internalRoles
      });
    }
  }, [collaboratorData]);

  return showInformation();
};

export default EditableCollaborator;

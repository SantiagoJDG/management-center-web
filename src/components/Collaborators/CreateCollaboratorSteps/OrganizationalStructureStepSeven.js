import { forwardRef, useState, useEffect } from 'react';
import { Grid, Divider, CardMedia, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import useMessage from 'hooks/useMessage';
import useCreate from 'hooks/useCreate';

const OrganizationalStructureStepSeven = forwardRef((props, ref) => {
  const { handleSubmit, trigger } = useForm();
  const { handleNewMessage } = useMessage();

  const REQUIRED_FIELDS = [
    { name: 'departmentId', description: 'Campo requerido' },
    { name: 'supervisorId', description: 'Campo requerido' },
    { name: 'profiles', description: 'Campo requerido' },
    { name: 'technologies', description: 'Campo requerido' },
    { name: 'knowledges', description: 'Campo requerido' }
  ];

  const [organizationalStructureInformation, setOrganizationalStructureInformation] = useState({
    departmentId: '',
    supervisorId: '',
    profiles: [],
    knowledges: [],
    technologies: []
  });

  const [supervisors, setSupervisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  const [isMounted, setIsMounted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/organizational-structure-information`,
    organizationalStructureInformation
  );

  const getOperationData = async () => {
    getDataInformation('/api/operation/supervisors', setSupervisors);
    getDataInformation('/api/hiring/departments', setDepartments);
    getDataInformation('/api/operation/structure-profiles', setProfiles);
    getDataInformation('/api/operation/structure-specialities', setKnowledges);
    getDataInformation('/api/operation/technologies', setTechnologies);
  };

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
      selectedValue.id = idReturned;
      callbackAfetedSaved([...previousElements, selectedValue]);
    }

    setOrganizationalStructureInformation({
      ...organizationalStructureInformation,
      [elementName]: selectedValue.id
    });

    setFormErrors({
      ...formErrors,
      [elementName]: { error: false, description: '' }
    });
  }

  async function handleAutoCompleteMultipleValues(_values, elementName) {
    if (!_values) return;

    let actualValues = organizationalStructureInformation[elementName]
      ? [...organizationalStructureInformation[elementName]]
      : [];

    const newValues = _values.map((value) => {
      if (value.inputValue) {
        const valueCreatedBefore = actualValues.find((item) => item.name === value.inputValue);

        return valueCreatedBefore;
      }
      return value;
    });

    setFormErrors({
      ...formErrors,
      [elementName]: { error: false, description: '' }
    });

    setOrganizationalStructureInformation({
      ...organizationalStructureInformation,
      [elementName]: [...newValues]
    });
  }

  function handleDepartment(deparment) {
    handleAutoCompleteValue(
      deparment,
      'departmentId',
      '/api/hiring/departments',
      setDepartments,
      departments
    );
  }

  function handleSupervisor(supervisor) {
    handleAutoCompleteValue(
      supervisor,
      'supervisorId',
      '/api/operation/supervisors',
      setSupervisors,
      supervisors
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

  function handleProfiles(_profiles) {
    handleAutoCompleteMultipleValues(
      _profiles,
      'profiles',
      '/api/operation/profiles',
      setProfiles,
      profiles
    );
  }

  const afterExecution = (execution) => {
    if (execution.status !== 200 || execution.data === 'SequelizeUniqueConstraintError') {
      handleNewMessage({
        text: 'Por favor revisar los campos que deben ser unicos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion de pago fué creada exitosamente',
        severity: 'success'
      });
      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      props.setFormCompleted(false);
    }
  };

  const validateForm = () => {
    handleDropdownErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const response = await create();
        afterExecution(response);
      })();
    }
  };

  const isFieldValid = (fieldName, value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  };

  const handleDropdownErrors = () => {
    const newErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      const { name, description } = field;
      const value = organizationalStructureInformation[name];
      if (!isFieldValid(name, value)) {
        newErrors[name] = { error: true, description };
      }
    });

    setFormErrors(newErrors);
  };

  useEffect(() => {
    if (!isMounted) {
      getOperationData();
      setIsMounted(true);
    }

    props.setFormCompleted(true);

    ref.current = validateForm;
  }, [isMounted, organizationalStructureInformation]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={5} p={2}>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.departmentId}
              name="departmentId"
              label="Direccion del reporte"
              optionList={departments}
              elmentCallback={handleDepartment}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.supervisorId}
              name="supervisorId"
              label="Supervisor"
              optionList={supervisors}
              elmentCallback={handleSupervisor}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
          <Grid item>
            <Grid item xs={12}>
              <CustomAutoComplete
                formError={formErrors.profiles}
                name="profiles"
                label="N1-Perfil"
                optionList={profiles}
                elmentCallback={handleProfiles}
                multiple={true}
                requiredField={true}
                canCreateNew={false}
              />
            </Grid>
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.knowledges}
              name="knowledges"
              label="N2-Especialidad"
              optionList={knowledges}
              elmentCallback={handleKnowledges}
              multiple={true}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.technologies}
              name="technologies"
              label="N3-tecnologías predominantes"
              optionList={technologies}
              elmentCallback={handleTechnologies}
              multiple={true}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <CardMedia
            sx={{
              width: 300,
              height: 300,
              margin: 1
            }}
            image="prop-02.png"
          />
        </Grid>
      </Grid>
    </Grid>
  );
});

export default OrganizationalStructureStepSeven;

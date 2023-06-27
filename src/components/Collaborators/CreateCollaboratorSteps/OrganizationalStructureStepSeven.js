import { forwardRef, useState, useEffect } from 'react';
import { Grid, Divider, CardMedia, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { CssTextField } from '../../../styles/formButton';
import { getAxiosInstance } from 'utils/axiosClient';

const OrganizationalStructureStepSeven = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const [organizationalStructureInformation, setOrganizationalStructureInformation] = useState({
    reportDirection: '',
    supervisor: '',
    profiles: [],
    knowledges: [],
    technologies: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const getOperationData = async () => {
    getDataInformation('/api/collaborator', setSupervisors);
    getDataInformation('/api/operation/profiles', setProfiles);
    getDataInformation('/api/operation/knowledges', setKnowledges);
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

  function handleSupervisor(supervisor) {
    if (!supervisor) return;

    setOrganizationalStructureInformation({
      ...organizationalStructureInformation,
      supervisor: supervisor.status.id
    });
    setFormErrors({
      ...formErrors,
      supervisor: { error: false, description: '' }
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

  const validateForm = () => {
    handleDropdownErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        return;
      })();
    }
  };

  const handleDropdownErrors = () => {
    if (
      !organizationalStructureInformation.supervisor ||
      !organizationalStructureInformation.profiles ||
      !organizationalStructureInformation.technologies ||
      !organizationalStructureInformation.knowledges
    ) {
      const newErrors = {
        ...formErrors,
        supervisor: {
          ...(organizationalStructureInformation.supervisor
            ? {}
            : { error: true, description: 'Campo requerido' })
        },
        profiles: {
          ...(!organizationalStructureInformation.profiles.length
            ? { error: true, description: 'Campo requerido' }
            : {})
        },
        technologies: {
          ...(!organizationalStructureInformation.technologies.length
            ? { error: true, description: 'Campo requerido' }
            : {})
        },
        knowledges: {
          ...(!organizationalStructureInformation.knowledges.length
            ? { error: true, description: 'Campo requerido' }
            : {})
        }
      };
      setFormErrors(newErrors);
    }
  };

  useEffect(() => {
    if (!isMounted) {
      getOperationData();
      setIsMounted(true);
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }
    ref.current = validateForm;
  }, [isMounted, organizationalStructureInformation]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={5} p={2}>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              name="reportDirection"
              size="small"
              placeholder="Selecciona la direccion"
              label="Direccion del reporte"
              {...register('reportDirection', {
                required: true,
                onChange: (event) =>
                  setOrganizationalStructureInformation({
                    ...organizationalStructureInformation,
                    reportDirection: event.target.value
                  })
              })}
              error={errors.reportDirection && true}
              helperText={
                errors.name && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.supervisor}
              name="supervisor"
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

OrganizationalStructureStepSeven.displayName = 'BillingInformationStepSeven';
export default OrganizationalStructureStepSeven;

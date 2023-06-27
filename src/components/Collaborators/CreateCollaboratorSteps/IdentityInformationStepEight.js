import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Typography
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAutoComplete from 'components/CustomAutoComplete';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAxiosInstance } from 'utils/axiosClient';
import { CssMuiFileInput, CssSelectInput, CssTextField } from '../../../styles/formButton';

const listRollUp = [
  { id: 1, name: 'Programa de pasantía' },
  { id: 2, name: 'Facilitador AC' },
  { id: 3, name: 'Programa de Consultor Senior' },
  { id: 4, name: 'Evaluador técnico de talentos' },
  { id: 5, name: 'Programa de referidos' }
];

const IdentityInformationStepEight = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const [isMounted, setIsMounted] = useState(false);
  const { handleNewMessage } = useMessage();

  const REQUIRED_FIELDS = [
    { name: 'seniorityId', description: 'Campo requerido' },
    { name: 'readinessId', description: 'Campo requerido' },
    { name: 'sessionDate', description: 'Campo requerido' },
    { name: 'nextSessionDate', description: 'Campo requerido' },
    { name: 'file', description: 'Campo requerido' }
  ];

  const [newIdentity, setnewIdentity] = useState({
    seniorityId: '',
    readinessId: '',
    sessionDate: undefined,
    nextSessionDate: undefined,
    supervisorId: '',
    rollingDevelopmentProgram: '',
    file: ''
  });

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/consultec-identity`,
    newIdentity,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  const [seniorities, setSeniorities] = useState([]);
  const [readinesses, setReadinesses] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [rolledUp, setRolledUp] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const getConsultecIdentityData = async () => {
    getDataInformation('/api/consultec-identity/seniorities', setSeniorities);
    getDataInformation('/api/consultec-identity/readiness', setReadinesses);
    getDataInformation('/api/operation/supervisors', setSupervisors);
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

  async function saveNewItem(paths, newItem) {
    try {
      let createdItem = await getAxiosInstance().post(paths, newItem);
      return createdItem.data;
    } catch (error) {
      console.error('Error while save new item...', error);
    }
  }

  const handleSelectValue = (selectedValue, elementName) => {
    if (!selectedValue) return;
    setnewIdentity({
      ...newIdentity,
      rollingDevelopmentProgram: selectedValue[elementName]
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

    setnewIdentity({
      ...newIdentity,
      [elementName]: selectedValue.id
    });

    setFormErrors({
      ...formErrors,
      [elementName]: { error: false, description: '' }
    });
  }

  function handleSeniority(seniority) {
    handleAutoCompleteValue(
      seniority,
      'seniorityId',
      '/api/consultec-identity/seniorities',
      setSeniorities,
      seniorities
    );
  }

  function handleReadliness(readiness) {
    handleAutoCompleteValue(
      readiness,
      'readinessId',
      '/api/consultec-identity/readiness',
      setReadinesses,
      readinesses
    );
  }

  function handleSessionDate(newValue) {
    setnewIdentity({
      ...newIdentity,
      sessionDate: moment(newValue).format()
    });

    setFormErrors({
      ...formErrors,
      sessionDate: { error: false, description: '' }
    });
  }

  function handleFileChange(newFile) {
    setnewIdentity({ ...newIdentity, file: newFile });
  }

  function handleNextSessionDate(newValue) {
    setnewIdentity({
      ...newIdentity,
      nextSessionDate: moment(newValue).format()
    });

    setFormErrors({
      ...formErrors,
      nextSessionDate: { error: false, description: '' }
    });
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

  const handleRolledUp = (event) => {
    const {
      target: { value }
    } = event;
    const rollUp = value;
    setRolledUp(value);
    handleSelectValue(rollUp, 'id');
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
      const value = newIdentity[name];
      if (!isFieldValid(name, value)) {
        newErrors[name] = { error: true, description };
      }
    });

    setFormErrors(newErrors);
  };

  const afterExecution = (execution) => {
    if (execution.status !== 200 || execution.data === 'SequelizeUniqueConstraintError') {
      handleNewMessage({
        text: 'Por favor revisar los campos que deben ser unicos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
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
        const execution = await create();
        afterExecution(execution);
      })();
    }
  };

  useEffect(() => {
    if (!isMounted) {
      getConsultecIdentityData();
      setIsMounted(true);
    }

    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');

    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }

    ref.current = validateForm;
  }, [newIdentity, isMounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={formErrors.seniorityId}
              name="seniorityId"
              label="Seniority en la empresa"
              optionList={seniorities}
              elmentCallback={handleSeniority}
              requiredField={true}
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={formErrors.readinessId}
              name="readinessId"
              label="Seleccione readiness"
              optionList={readinesses}
              elmentCallback={handleReadliness}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="sessionDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de sesión"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleSessionDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de sesión'}
                        placeholder="DD/MM/YYYY"
                        name="sessionDate"
                        error={errors.sessionDate && true}
                        helperText={
                          errors.sessionDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('sessionDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <Controller
              name="file"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CssMuiFileInput
                  size="small"
                  label="Adjuntar archivo"
                  value={field.value}
                  onChange={(newValue) => {
                    handleFileChange(newValue);
                    field.onChange(newValue);
                  }}
                  error={errors.file}
                  helperText={
                    errors.file && (
                      <Typography variant="caption" color="error" sx={{ boxSizing: 'content-box' }}>
                        Campo requerido
                      </Typography>
                    )
                  }
                />
              )}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="nextSessionDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de proxima sesión"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleNextSessionDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de proxima sesión'}
                        placeholder="DD/MM/YYYY"
                        name="nextSessionDate"
                        error={errors.nextSessionDate && true}
                        helperText={
                          errors.nextSessionDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('nextSessionDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={formErrors.supervisorId}
              name="supervisorId"
              label="Lider Responsable"
              optionList={supervisors}
              elmentCallback={handleSupervisor}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%' }}>
              <InputLabel
                id="rollingDevelopmentProgram"
                error={errors.rollingDevelopmentProgram && !rolledUp}
              >
                Programa de desarrollo enrollados
              </InputLabel>
              <CssSelectInput
                labelId="rollingDevelopmentProgram"
                label="programa de desarrollo enrollados"
                id="rollingDevelopmentProgram"
                value={rolledUp}
                onChange={handleRolledUp}
                error={errors.rollingDevelopmentProgram && !rolledUp}
                {...register('rollingDevelopmentProgram', {
                  required: true,
                  onChange: handleRolledUp
                })}
              >
                {listRollUp.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.rollingDevelopmentProgram && !rolledUp && (
                <FormHelperText error>Campo requerido</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

IdentityInformationStepEight.displayName = 'Identity Consultec';

export default IdentityInformationStepEight;

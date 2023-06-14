import {
  Divider,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Grid,
  Typography
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAutoComplete from 'components/CustomAutoComplete';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAxiosInstance } from 'utils/axiosClient';
import { CssMuiFileInput, CssTextField, CssSelectInput } from '../../../styles/formButton';

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
    formState: { errors }
  } = useForm();

  const [isMounted, setIsMounted] = useState(false);
  const { handleNewMessage } = useMessage();

  const [newIdentity, setnewIdentity] = useState({
    responsibleLeader: '',
    startSesiondate: undefined,
    endSesiondate: undefined,
    file: '',
    readliness: [
      {
        name: '',
        readlinesId: undefined
      }
    ],
    seniority: [
      {
        name: '',
        seniorityId: undefined
      }
    ],
    rollingDevelopmentProgram: ''
  });

  const [create] = useCreate('/api/consultec-identity', newIdentity, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const [seniority, setSeniority] = useState([]);
  const [readiness, setReadiness] = useState([]);
  const [rolledUp, setRolledUp] = useState('');
  const [rolledUpErrors, setRolledUpErrors] = useState({});

  const getConsultecIdentityData = async () => {
    getDataInformation('/api/consultec-identity/seniorities', setSeniority);
    getDataInformation('/api/consultec-identity/readiness', setReadiness);
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

  const handleFileChange = (newFile) => {
    setnewIdentity({ ...newIdentity, file: newFile });
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
    const newSeniorities = { ...newIdentity.seniorities, [elementName]: selectedValue.id };
    setnewIdentity({
      ...newIdentity,
      residency: newSeniorities
    });

    setRolledUpErrors({ ...rolledUpErrors, [elementName]: { error: false, description: '' } });
  }

  function handleSeniority(seniorities) {
    handleAutoCompleteValue(
      seniorities,
      'id',
      '/api/consultec-identity/seniorities',
      setSeniority,
      seniority
    );
  }

  function handleReadliness(readiness) {
    handleAutoCompleteValue(
      readiness,
      'id',
      '/api/consultec-identity/readiness',
      setReadiness,
      readiness
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

  const handlerolledUpErrors = () => {
    if (!newIdentity.readliness.readlinesId || !newIdentity.seniority.seniorityId) {
      const newErrors = {
        ...rolledUpErrors,
        readlinesId: {
          ...(newIdentity.readlinesId ? {} : { error: true, description: 'Campo requerido' })
        },
        seniorityId: {
          ...(newIdentity.seniorityId ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setRolledUpErrors(newErrors);
    }
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
      const idnewIdentity = execution.data;
      props.setnewIdentityId(idnewIdentity);
      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const validateForm = () => {
    handlerolledUpErrors();
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
    ref.current = validateForm;
  }, [newIdentity, isMounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={rolledUpErrors.countryId}
              name="countryId"
              label="Seniority en la empresa"
              optionList={seniority}
              elmentCallback={handleSeniority}
              requiredField={true}
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={rolledUpErrors.cityId}
              name="cityId"
              label="Seleccione  readiness"
              optionList={readiness}
              elmentCallback={handleReadliness}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="startSesiondate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de sesión"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '62%' }}
                        required
                        size="small"
                        label={'Fecha de sesión'}
                        placeholder="DD/MM/YYYY"
                        name="startSesiondate"
                        error={errors.startSesiondate && true}
                        helperText={
                          errors.startSesiondate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('startSesiondate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
            <Controller
              name="file"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CssMuiFileInput
                  sx={{ width: '35%', ml: 1 }}
                  size="small"
                  placeholder="file"
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
                name="endSesiondate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha final de sesión"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de proxima sesión'}
                        placeholder="DD/MM/YYYY"
                        name="endSesiondate"
                        error={errors.endSesiondate && true}
                        helperText={
                          errors.endSesiondate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('endSesiondate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              size="small"
              name="responsibleLeader"
              placeholder="Lider Responsable"
              label="Lider Responsable"
              {...register('responsibleLeader', {
                required: true,
                onChange: (event) =>
                  setnewIdentity({ ...newIdentity, responsibleLeader: event.target.value })
              })}
              error={errors.responsibleLeader && true}
              helperText={
                errors.responsibleLeader && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
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

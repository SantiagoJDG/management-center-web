import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import { Avatar, Divider, Grid, ListItemIcon, Typography } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAutoComplete from 'components/CustomAutoComplete';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAxiosInstance } from 'utils/axiosClient';
import { CssMuiFileInput, CssTextField } from '../../../styles/formButton';

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
    rollingDevelopmentProgram: [
      {
        name: '',
        seniorityId: undefined
      }
    ]
  });

  const [create] = useCreate('/api/collaborator', newIdentity, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const [initialDate, setInitialDate] = useState();
  const [seniority, setSeniority] = useState([]);
  const [readliness, setReadliness] = useState([]);
  const [residencyErrors, setResidencyErrors] = useState({});
  const [errorEmailMessage, setEmailErrorMessage] = useState('');
  const [photo, setPhoto] = useState();
  const secondTextFieldRef = useRef(null);

  const getResidenceData = async () => {
    getDataInformation('/api/consultec-identity/seniorities', setSeniority);
    getDataInformation('/api/consultec-identity/readiness', setReadliness);
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

  const handleFileChange = (newFile) => {
    setnewIdentity({ ...newIdentity, file: newFile });
    setPhoto(newFile ? URL.createObjectURL(newFile) : '');
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
    const newResidency = { ...newIdentity.residency, [elementName]: selectedValue.id };
    setnewIdentity({
      ...newIdentity,
      residency: newResidency
    });

    setResidencyErrors({ ...residencyErrors, [elementName]: { error: false, description: '' } });
  }

  function handleSeniority(country) {
    handleAutoCompleteValue(
      country,
      'id',
      '/api/consultec-identity/seniorities',
      setSeniority,
      seniority
    );
  }

  function handleReadliness(readliness) {
    handleAutoCompleteValue(
      readliness,
      'cityId',
      '/api/consultec-identity/readiness',
      setReadliness,
      readliness
    );
  }



  const handleAddNationality = () => {
    setNationalities([...nationalities, { docAdress: '', countryId: 1 }]);
  };

  const handleNationalityChange = (event, index) => {
    const newNationalities = [...nationalities];
    newNationalities[index] = {
      ...newNationalities[index],
      docAdress: event.target.value,
      countryId: 1
    };
    setNationalities(newNationalities);
    setnewIdentity({
      ...newIdentity,
      nationalities: newNationalities
    });
  };

  const handleResidencyErrors = () => {
    if (!newIdentity.residency.countryId || !newIdentity.residency.cityId) {
      const newErrors = {
        ...residencyErrors,
        countryId: {
          ...(newIdentity.countryId ? {} : { error: true, description: 'Campo requerido' })
        },
        cityId: {
          ...(newIdentity.cityId ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setResidencyErrors(newErrors);
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
    handleResidencyErrors();
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
      getResidenceData();
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
              formError={residencyErrors.countryId}
              name="countryId"
              label="Antigüedad "
              optionList={seniority}
              elmentCallback={handleSeniority}
              requiredField={true}
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={residencyErrors.cityId}
              name="cityId"
              label="Preparación"
              optionList={readliness}
              elmentCallback={handleReadliness}
              requiredField={true}
            />
          </Grid>

          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="birthdate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleOnChangeDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '77%' }}
                        required
                        label={'Fecha de nacimiento'}
                        placeholder="DD/MM/YYYY"
                        name="birthdate"
                        error={errors.birthdate && true}
                        helperText={
                          errors.birthdate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('birthdate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="birthdate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleOnChangeDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '77%' }}
                        required
                        label={'Fecha de nacimiento'}
                        placeholder="DD/MM/YYYY"
                        name="birthdate"
                        error={errors.birthdate && true}
                        helperText={
                          errors.birthdate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('birthdate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              size="small"
              name="lastName"
              placeholder="Apellido completo del Consultor"
              label="Apellido del Consultor"
              {...register('lastName', {
                required: true,
                onChange: (event) =>
                  setnewIdentity({ ...newIdentity, lastName: event.target.value })
              })}
              error={errors.lastName && true}
              helperText={
                errors.lastName && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={residencyErrors.cityId}
              name="cityId"
              label="Ciudad de residencia"
              optionList={states}
              elmentCallback={handleState}
              requiredField={true}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

IdentityInformationStepEight.displayName = 'Identity Information';

export default IdentityInformationStepEight;

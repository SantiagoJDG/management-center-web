import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import {
  Avatar,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Typography,
  FormHelperText
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAutoComplete from 'components/CustomAutoComplete';
import useCreate from 'hooks/useCreate';
import useEdit from 'hooks/useEdit';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getAxiosInstance } from 'utils/axiosClient';
import { CssMuiFileInput, CssTextField, CssSelectInput } from '../../../styles/formButton';

const PersonalInformationStepOne = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty },
    setValue
  } = useForm();
  const watchAllFields = watch();

  const [isMounted, setIsMounted] = useState(false);
  const { handleNewMessage } = useMessage();

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    lastName: '',
    birthdate: undefined,
    personalEmail: undefined,
    file: '',
    residency: {
      countryId: '',
      cityId: '',
      address: ''
    },
    nationalities: [
      {
        docAdress: '',
        countryId: undefined
      }
    ],
    contactPhones: [
      {
        areaCode: '',
        number: undefined
      }
    ]
  });

  const [edit] = useEdit(`/api/collaborator/${props.formData.newCollaboratorId}`, newCollaborator, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const [create] = useCreate('/api/collaborator', newCollaborator, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const [initialDate, setInitialDate] = useState();
  const [age, setAge] = useState(
    Object.keys(props.formData).length
      ? moment(moment().format()).diff(moment(props.formData.birthdate).format(), 'year')
      : 0
  );

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [phoneNumbers, setPhoneNumbers] = useState([{ areaCode: '', number: '' }]);
  const [nationalities, setNationalities] = useState([{ docAdress: '', countryId: '' }]);

  const [errorEmailMessage, setEmailErrorMessage] = useState('');
  const [residencyErrors, setResidencyErrors] = useState({});

  const [photo, setPhoto] = useState();

  const secondTextFieldRef = useRef(null);

  const getResidenceData = async () => {
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/residence/cities', setStates);
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
    setNewCollaborator({ ...newCollaborator, file: newFile });
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
    const newResidency = { ...newCollaborator.residency, [elementName]: selectedValue.id };
    setNewCollaborator({
      ...newCollaborator,
      residency: newResidency
    });

    setResidencyErrors({ ...residencyErrors, [elementName]: { error: false, description: '' } });
  }

  function handleCountry(country) {
    handleAutoCompleteValue(
      country,
      'countryId',
      '/api/residence/countries',
      setCountries,
      countries
    );
  }
  function handleState(state) {
    handleAutoCompleteValue(state, 'cityId', '/api/residence/states', setStates, states);
  }

  const handleOnChangeDate = (newValue) => {
    setNewCollaborator({ ...newCollaborator, birthdate: moment(newValue).format() });
    setInitialDate(moment(newValue).format());
    handleSetAge(initialDate);
  };

  const handleSetAge = (date) => {
    const diff = moment(moment().format()).diff(date, 'year');
    setAge(diff);
  };

  const handleOnChangeEmail = (event) => {
    const inputValue = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputValue)) {
      setEmailErrorMessage('');
      setNewCollaborator({ ...newCollaborator, personalEmail: inputValue });
    } else {
      setEmailErrorMessage('El valor ingresado no es un correo electrónico válido.');
    }
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { areaCode: '', number: '' }]);
  };

  const handlePhoneChange = (event, index, key) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index][key] = event.target.value;

    if (key === 'areaCode') {
      const input = event.target.value;
      const expectedLength = 3;

      if (input.length === expectedLength) {
        secondTextFieldRef.current.focus();
      }
    }
    setNewCollaborator({
      ...newCollaborator,
      contactPhones: newPhoneNumbers
    });
  };

  const displayPhoneNumber = (contactNumberToBeDisplayed) => {
    return contactNumberToBeDisplayed?.map((phone, index) => (
      <Grid item key={index}>
        <CssTextField
          required
          sx={{ width: '25%' }}
          id={`areaCode-${index}`}
          label="Code"
          placeholder="000"
          type="number"
          name={`areaCode-${index}`}
          variant="outlined"
          size="small"
          value={phone.areaCode}
          {...register(`areaCode-${index}`, {
            required: true,
            onChange: (event) => handlePhoneChange(event, index, 'areaCode')
          })}
          error={errors[`areaCode-${index}`]}
        />
        <CssTextField
          required
          sx={{ width: '60%', ml: 1 }}
          id={`number-${index}`}
          name={`number-${index}`}
          label="Telefono de contacto"
          placeholder="0000 00000"
          type="number"
          size="small"
          variant="outlined"
          inputRef={secondTextFieldRef}
          value={phone.number}
          {...register(`number-${index}`, {
            required: true,
            onChange: (event) => handlePhoneChange(event, index, 'number')
          })}
          error={errors[`number-${index}`]}
          helperText={
            errors[`number-${index}`] && (
              <Typography variant="caption" color="error">
                Campo requerido
              </Typography>
            )
          }
        />
      </Grid>
    ));
  };

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
    setNewCollaborator({
      ...newCollaborator,
      nationalities: newNationalities
    });
  };

  const displayNationalities = (nationalitiesArray) => {
    return nationalitiesArray.map((value, index) => {
      const { docAdress } = value;
      const selectedCountry = countries.find((country) => country.id === docAdress.id);
      const defaultValue = selectedCountry ? selectedCountry : '';
      return (
        <Grid item key={index} sx={{ width: '100%' }}>
          <FormControl size="small" sx={{ width: '100%' }}>
            <InputLabel
              id="nationalities"
              error={errors[`nationalities-${index}`] && !value.docAdress}
            >
              Nacionalidades
            </InputLabel>
            <CssSelectInput
              labelId="nationalities"
              label="Nacionalidades"
              required
              size="small"
              name={`nationalities-${index}`}
              value={Object.keys(props.formData).length ? defaultValue : docAdress}
              {...register(`nationalities-${index}`, {
                required: true,
                onChange: (event) => handleNationalityChange(event, index)
              })}
              error={errors[`nationalities-${index}`] && !value.docAdress}
              helperText={
                errors[`nationalities-${index}`] && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            >
              {countries.map((country, index) => {
                return (
                  <MenuItem value={country} key={index}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </CssSelectInput>
            {errors[`nationalities-${index}`] && !value.docAdress && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </FormControl>
        </Grid>
      );
    });
  };

  const handleResidencyErrors = () => {
    if (!newCollaborator.residency.countryId || !newCollaborator.residency.cityId) {
      const newErrors = {
        ...residencyErrors,
        countryId: {
          ...(newCollaborator.countryId ? {} : { error: true, description: 'Campo requerido' })
        },
        cityId: {
          ...(newCollaborator.cityId ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setResidencyErrors(newErrors);
    }
  };

  const handleExecution = (execution) => {
    if (execution.status !== 200) {
      handleNewMessage({
        text: 'Por favor revisar los campos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
        severity: 'success'
      });
      handlerStepperValidation(execution);
    }
  };

  const handlerStepperValidation = (execution) => {
    const idNewCollaborator = execution.data;
    props.setNewCollaboratorId(idNewCollaborator);
    props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
    props.setFormCompleted(false);
    props.rememberStepFormInformation(props.stepName, newCollaborator);
  };

  const validateForm = () => {
    console.log(newCollaborator);
    let execution = undefined;
    handleResidencyErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        try {
          Object.keys(props.formData).length
            ? (execution = await edit())
            : (execution = await create());
          handleExecution(execution);
        } catch (error) {
          return error;
        }
      })();
    }
  };

  const findObject = (array, id) => {
    const finded = array.find((each) => {
      return each.id === id;
    });
    return finded;
  };

  const returnedStep = (formData) => {
    setNewCollaborator(formData);
    setPhoto(URL.createObjectURL(formData.file));
    setValue('file', `${formData.file}`);
    formData.nationalities?.map((nationality, index) => {
      setValue(`nationalities-${index}`, `${nationality}`);
    });
  };

  useEffect(() => {
    if (!isMounted) {
      getResidenceData();
      setIsMounted(true);
      if (Object.keys(props.formData).length) {
        const { formData } = props;
        returnedStep(formData);
      }
    }

    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');

    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }

    ref.current = validateForm;
  }, [age, newCollaborator, isMounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item>
            <Grid container>
              <Grid
                item
                sx={{
                  position: 'absolute',
                  top: 235
                }}
              >
                <Avatar sx={{ height: '60px', width: '60px' }} src={photo}>
                  <HailRoundedIcon fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item>
                <Controller
                  name="file"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CssMuiFileInput
                        size="small"
                        placeholder="Adjuntar y subir archivo"
                        label="Fotografia del Consultor"
                        value={value}
                        onChange={(newValue) => {
                          handleFileChange(newValue);
                          onChange(newValue);
                        }}
                        error={errors.file}
                        helperText={
                          errors.file && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ boxSizing: 'content-box' }}
                            >
                              Campo requerido
                            </Typography>
                          )
                        }
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              defaultValue={props.formData ? props.formData.name : ''}
              name="name"
              size="small"
              placeholder="Nombre completo del Consultor"
              label="Nombre del Consultor"
              {...register('name', {
                required: true,
                onChange: (event) =>
                  setNewCollaborator({ ...newCollaborator, name: event.target.value })
              })}
              error={errors.name && true}
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
            <CssTextField
              sx={{ width: '100%' }}
              required
              size="small"
              name="lastName"
              placeholder="Apellido completo del Consultor"
              defaultValue={props.formData ? props.formData.lastName : ''}
              label="Apellido del Consultor"
              {...register('lastName', {
                required: true,
                onChange: (event) =>
                  setNewCollaborator({ ...newCollaborator, lastName: event.target.value })
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
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="birthdate"
                control={control}
                defaultValue={
                  Object.keys(props.formData).length
                    ? moment(props.formData.birthdate).format('YYYY-MM-DD')
                    : ''
                }
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de nacimiento"
                    maxDate={moment().format()}
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
            <CssTextField
              sx={{ width: '20%', ml: 1 }}
              label="Edad"
              value={age}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              required
              sx={{ width: '100%' }}
              label="Email"
              variant="outlined"
              size="small"
              fullWidth
              defaultValue={props.formData ? props.formData.personalEmail : ''}
              name="personalEmail"
              {...register('personalEmail', {
                required: true,
                onChange: (event) => handleOnChangeEmail(event)
              })}
              error={errors.personalEmail || !!errorEmailMessage}
              helperText={
                errorEmailMessage ||
                (errors.personalEmail && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                ))
              }
            />
          </Grid>
          {Object.keys(props.formData).length
            ? displayPhoneNumber(props.formData.contactPhones)
            : displayPhoneNumber(phoneNumbers)}
          <Grid sx={{ pl: 2, pt: 1 }}>
            <ListItemIcon>
              <AddCircleOutlineIcon color="info" onClick={handleAddPhoneNumber} fontSize="small" />
              <Typography
                onClick={handleAddPhoneNumber}
                variant="h9"
                sx={{ color: 'info.main', fontSize: 'small' }}
              >
                Agregar campo telefónico
              </Typography>
            </ListItemIcon>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item sx={{ width: '100%' }}>
            <CustomAutoComplete
              formError={residencyErrors.countryId}
              name="countryId"
              label="País de residencia"
              optionList={countries}
              elmentCallback={handleCountry}
              requiredField={true}
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(countries, props.formData.residency?.countryId) : ''
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
              canCreateNew={false}
              prechargedValue={
                props.formData ? findObject(states, props.formData.residency?.cityId) : ''
              }
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '25vw' }}
              defaultValue={props.formData ? props.formData.residency?.address : ''}
              required
              size="small"
              name="address"
              placeholder="Escriba la dirección residencial"
              label="Dirección residencial"
              {...register('address', {
                required: true,
                onChange: (event) => {
                  const newResidency = {
                    ...newCollaborator.residency,
                    address: event.target.value
                  };
                  setNewCollaborator({
                    ...newCollaborator,
                    residency: newResidency
                  });
                }
              })}
              error={errors.address && true}
              helperText={
                errors.address && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          {Object.keys(props.formData).length
            ? displayNationalities(props.formData.nationalities)
            : displayNationalities(nationalities)}
          <Grid sx={{ pl: 2, pt: 1 }}>
            <ListItemIcon>
              <AddCircleOutlineIcon color="info" fontSize="small" onClick={handleAddNationality} />
              <Typography
                onClick={handleAddNationality}
                variant="h9"
                sx={{ color: 'info.main', fontSize: 'small' }}
              >
                Agregar nacionalidad
              </Typography>
            </ListItemIcon>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
PersonalInformationStepOne.displayName = 'PersonalInformationStepOne';
export default PersonalInformationStepOne;

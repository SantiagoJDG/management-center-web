import { Grid, Divider, TextField, Avatar, ListItemIcon, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import { useForm, Controller } from 'react-hook-form';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import moment from 'moment';
import 'moment/locale/es';
import { useState, useEffect, useRef } from 'react';
import useCreate from 'hooks/useCreate';

const PersonalInformation = ({ onPersonalInfoCompleted }) => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors }
  } = useForm();

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    lastName: '',
    birthdate: undefined,
    personalEmail: undefined,
    photoAdress: '',
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
  const [create] = useCreate('/api/collaborator', newCollaborator);

  const [initialDate, setInitialDate] = useState();

  const [age, setAge] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [phoneNumbers, setPhoneNumbers] = useState([{ areaCode: '', number: '' }]);
  const [nationalities, setNationalities] = useState([{ docAdress: '', countryId: '' }]);

  // const [email, setEmail] = useState();
  const [errorEmailMessage, setEmailErrorMessage] = useState('');

  const [residencyErrors, setResidencyErrors] = useState({});

  const secondTextFieldRef = useRef(null);

  const getResidenceData = async () => {
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/residence/states', setStates);
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
    const diff = moment(moment().format()).diff(initialDate, 'year');
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
    setPhoneNumbers(newPhoneNumbers);

    if (key === 'areaCode') {
      const input = event.target.value;
      const expectedLength = 3;

      if (input.length === expectedLength) {
        secondTextFieldRef.current.focus();
      }
    }
  };

  const handleAddNationality = () => {
    setNationalities([...nationalities, { docAdress: '', countryId: '' }]);
  };

  const handleNationalityChange = (event, index) => {
    const newNationalities = [...nationalities];
    newNationalities[index] = { ...newNationalities[index], docAdress: event.target.value };
    setNationalities(newNationalities);
  };

  const handleButtonClick = () => {
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

    const isValid = trigger();

    if (isValid) {
      setNewCollaborator({
        ...newCollaborator,
        contactPhones: phoneNumbers,
        nationalities: nationalities
      });

      handleSubmit(() => {
        console.log(newCollaborator);
        create;
        onPersonalInfoCompleted(true);
      })();
    }
  };

  useEffect(() => {
    getResidenceData();
  }, [age, setResidencyErrors]);

  return (
    <form noValidate>
      <Grid container direction={'row'} xs={12} justifyContent={'start'} p={2}>
        <Grid item xs={6}>
          <Grid container direction={'column'} spacing={2} p={2}>
            <Grid item>
              <Grid container xs={3}>
                <Grid
                  item
                  sx={{
                    position: 'absolute',
                    top: 240
                  }}
                >
                  <Avatar sx={{ height: '60px', width: '60px' }}>
                    <HailRoundedIcon fontSize="large" />
                  </Avatar>
                </Grid>
              </Grid>
              <TextField
                sx={{ width: '100%' }}
                required
                size="small"
                name="photoAdress"
                placeholder="Adjuntar y subir archivo"
                label="Fotografia del Consultor"
                {...register('photoAdress', {
                  required: true,
                  onChange: (event) =>
                    setNewCollaborator({ ...newCollaborator, photoAdress: event.target.value })
                })}
                error={errors.photoAdress && true}
                helperText={
                  errors.photoAdress && (
                    <Typography variant="caption" color="error">
                      Campo requerido
                    </Typography>
                  )
                }
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: '100%' }}
                required
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
              <TextField
                sx={{ width: '100%' }}
                required
                size="small"
                name="lastName"
                placeholder="Apellido completo del Consultor"
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
                        <TextField
                          {...params}
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
              <TextField
                sx={{ width: '27%', ml: 1 }}
                label="Edad"
                value={age}
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                required
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                name="personalEmail"
                {...register('personalEmail', {
                  required: true,
                  onChange: handleOnChangeEmail
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
            {phoneNumbers.map((phone, index) => (
              <Grid item key={index}>
                <TextField
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
                  helperText={
                    errors[`areaCode-${index}`] && (
                      <Typography variant="caption" color="error">
                        Campo requerido
                      </Typography>
                    )
                  }
                />
                <TextField
                  required
                  sx={{ width: '70%', ml: 1 }}
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
            ))}
            <Grid item p={1}>
              <ListItemIcon>
                <AddCircleOutlineIcon color="info" onClick={handleAddPhoneNumber} />
                <Typography onClick={handleAddPhoneNumber} variant="h9" sx={{ color: 'info.main' }}>
                  Agregar informacion personal
                </Typography>
              </ListItemIcon>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem></Divider>
        <Grid item xs={5}>
          <Grid container spacing={2} p={2} direction={'column'}>
            <Grid item>
              <CustomAutoComplete
                formError={residencyErrors.countryId}
                name="countryId"
                label="País de residencia"
                optionList={countries}
                elmentCallback={handleCountry}
                requiredField={true}
              />
            </Grid>
            <Grid item>
              <CustomAutoComplete
                formError={residencyErrors.cityId}
                name="cityId"
                label="Ciudad de residencia"
                optionList={states}
                elmentCallback={handleState}
                requiredField={true}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: '100%' }}
                required
                size="small"
                name="address"
                placeholder="Escribe tu direccion residencial"
                label="Direcion residencial"
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
            {nationalities.map((value, index) => (
              <Grid item key={index}>
                <TextField
                  required
                  size={'small'}
                  name={'nacionalidades'}
                  label="Naionalidades"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  value={value.docAdress}
                  onChange={(event) => handleNationalityChange(event, index)}
                  error={errors['nacionalidades']}
                  helperText={
                    errors['nacionalidades'] && (
                      <Typography variant="caption" color="error">
                        Campo requerido
                      </Typography>
                    )
                  }
                />
              </Grid>
            ))}
            <Grid item p={1}>
              <ListItemIcon>
                <AddCircleOutlineIcon color="info" onClick={handleAddNationality} />
                <Typography onClick={handleAddNationality} variant="h9" sx={{ color: 'info.main' }}>
                  Agregar nacionalidad
                </Typography>
              </ListItemIcon>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <button type="button" onClick={handleButtonClick}>
        Submit
      </button>
    </form>
  );
};

export default PersonalInformation;

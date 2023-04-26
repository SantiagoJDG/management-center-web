import { Grid, Divider, TextField, Avatar, FormControl, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HailRoundedIcon from '@mui/icons-material/HailRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import useMessage from 'hooks/useMessage';
import { useForm } from 'react-hook-form';

import moment from 'moment';
import 'moment/locale/es';
import { useState, useEffect, useRef } from 'react';

const PersonalInformation = ({ onPersonalInfoCompleted }) => {
  const { register, handleSubmit } = useForm();

  // const { handleNewMessage } = useMessage();

  const [initialDate, setInitialDate] = useState();

  const [age, setAge] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [formErrors, setFormErrors] = useState({});

  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    lastName: '',
    birthdate: undefined,
    personalEmail: undefined,
    photoAdress: '',
    residency: {
      address: '',
      countryId: '',
      cityId: ''
    },
    nationalities: [
      {
        docAdress: '',
        countryId: undefined
      }
    ],
    contactPhones: [
      {
        areaCode: code,
        number: undefined
      }
    ]
  });

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
    console.log(elementName);
    console.log(selectedValue.id);
    setNewCollaborator({ ...newCollaborator, [elementName]: selectedValue.id });
  }

  function handleCountry(country) {
    handleAutoCompleteValue(
      country,
      'residency.countryId',
      '/api/residence/countries',
      setCountries,
      countries
    );
  }
  function handleState(state) {
    handleAutoCompleteValue(state, 'residency.cityId', '/api/residence/states', setStates, states);
  }

  const handleOnChangeDate = (newValue) => {
    setNewCollaborator({ ...newCollaborator, birthdate: moment(newValue).format() });
    setInitialDate(moment(newValue).format());
    const diff = moment(moment().format()).diff(initialDate, 'year');
    setAge(diff);
  };

  const handleOnChangeEmail = (event) => {
    const inputValue = event.target.value;
    setEmail(inputValue);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputValue)) {
      setEmail(inputValue);
      setErrorMessage('');
    } else {
      setErrorMessage('El valor ingresado no es un correo electrónico válido.');
    }
  };

  const handleCodeChange = (event) => {
    const input = event.target.value;
    const expectedLength = 3;

    setCode(input);

    if (input.length === expectedLength) {
      secondTextFieldRef.current.focus();
    }
  };

  const handlePhoneNumer = (event) => {
    const phoneNumber = event.target.value;
    setPhoneNumber(phoneNumber);
  };

  const handleFormSubmit = () => {
    onPersonalInfoCompleted(true);
  };
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    getResidenceData();
  }, [age]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('photoAdress', { required: true })}
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
                {...register('name', { required: true })}

                // value={newCollaborator.name}
                // error={formErrors.name && formErrors.name.error}
                // helperText={formErrors.name && formErrors.name.description}
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
                {...register('lastName', { required: true })}

                // value={newCollaborator.lastName}
                // error={formErrors.lastName && formErrors.lastName.error}
                // helperText={formErrors.lastName && formErrors.lastName.description}
              />
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  required
                  // name="birthdate"
                  label="Fecha de nacimiento"
                  maxDate={moment().format()}
                  onChange={(newValue) => {
                    handleOnChangeDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  // {...register('birthdate', {
                  //   required: true,
                  //   onChange: handleOnChangeDate(newValue)
                  // })}
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
                error={!!errorMessage}
                helperText={errorMessage}
                {...register('personalEmail', {
                  required: true,
                  onChange: handleOnChangeEmail
                })}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                sx={{ width: '25%' }}
                id="code"
                label="Code"
                placeholder="000"
                type="number"
                name="code"
                variant="outlined"
                size="small"
                value={code}
                {...register('code', { required: true, onChange: handleCodeChange })}
              />
              <TextField
                required
                sx={{ width: '70%', ml: 1 }}
                id="number"
                name="number"
                label="Telefono de contacto"
                placeholder="0000 00000"
                type="number"
                size="small"
                variant="outlined"
                onChange={handlePhoneNumer}
                inputRef={secondTextFieldRef}
                {...register('number', { required: true })}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem></Divider>
        <Grid item xs={5}>
          <Grid container spacing={2} p={2} direction={'column'}>
            <Grid item>
              <CustomAutoComplete
                formError={formErrors.country}
                label="País de residencia"
                optionList={countries}
                elmentCallback={handleCountry}
                requiredField={true}
                // {...register('countryID', { required: true })}
              />
            </Grid>
            <Grid item>
              <CustomAutoComplete
                formError={formErrors.state}
                name="cityId"
                label="Ciudad de residencia"
                optionList={states}
                elmentCallback={handleState}
                requiredField={true}
                // {...register('cityId', { required: true })}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: '100%' }}
                name="address"
                required
                size="small"
                placeholder="Escribe tu direccion residencial"
                label="Direcion residencial"
                error={formErrors.address && formErrors.address.error}
                helperText={formErrors.address && formErrors.address.description}
                {...register('address', { required: true })}
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{ width: '100%' }}
                name="nationalities"
                required
                size="small"
                placeholder="Escribe una ancionalidad"
                label="Nacionalidades"
                {...register('nationalities', { required: true })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <button onSubmit>xlick</button>
    </form>
  );
};

export default PersonalInformation;

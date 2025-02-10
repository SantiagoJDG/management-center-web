import { useEffect, useState, useMemo, forwardRef, useRef } from 'react';
import useGet from 'hooks/useGet';
import { Grid, Avatar } from '@mui/material';
import { CssTextFieldStandard } from '../../../styles/formButton';
import HailRoundedIcon from '@mui/icons-material/HailRounded';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAutoComplete from 'components/CustomAutoComplete';
import PersonalInformationStepOne from 'components/Collaborators/CreateCollaboratorSteps/PersonalnformationStepOne';
import useMessage from 'hooks/useMessage';
import useEdit from 'hooks/useEdit';
import moment from 'moment';
import 'moment/locale/es';
import { getDataInformation } from '../../../utils/dataUtils';

const PersonalInformation = forwardRef((props, ref) => {
  const [collaboratorInfo, setCollaboratorInfo] = useState();
  const validationRef = useRef(null);

  const [fetchData] = useGet(`/api/collaborator/${props.collaboratorId}`, setCollaboratorInfo);
  const memoizedInfo = useMemo(() => {
    return collaboratorInfo;
  }, [collaboratorInfo]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const { handleNewMessage } = useMessage();
  const [photo] = useState();
  const [newValue, setNewValue] = useState({
    name: '',
    lastName: '',
    birthdate: '',
    personalEmail: '',
    file: '',
    residencies: [
      {
        countryId: '',
        city: {
          id: '',
          name: ''
        },
        country: {
          id: '',
          name: ''
        },
        address: ''
      }
    ],
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
  const [edit] = useEdit(`/api/collaborator/${props.collaboratorId}`, newValue, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  function handleCountry(country) {
    handleAutoCompleteValue(country, 'countryId');
  }

  function handleCity(city) {
    handleAutoCompleteValue(city, 'cityId');
  }

  function handleNationality(nationality) {
    handleAutoCompleteValue(nationality, 'nationality');
  }

  async function handleAutoCompleteValue(selectedValue, elementName) {
    if (!selectedValue) return;

    const newResidency = { ...newValue.residencies, [elementName]: selectedValue.id };
    setNewValue({
      ...newValue,
      residencies: newResidency
    });
  }

  const getDropdownData = async () => {
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/residence/cities', setStates);
  };

  const handleChange = (value, propName) => {
    setNewValue({ ...newValue, [propName]: value });
  };

  const handleChangeAddress = (value, propName, index) => {
    setNewValue((prevState) => {
      const updatedResidencies = [...prevState.residencies];
      updatedResidencies[index] = {
        ...updatedResidencies[index],
        [propName]: value
      };

      return {
        ...prevState,
        residencies: updatedResidencies
      };
    });
  };

  const findObject = (array, id) => array.find((each) => each.id === id);

  const displayPhoto = () => {
    return (
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
      </Grid>
    );
  };

  const displayName = () => {
    return (
      <CssTextFieldStandard
        sx={{ width: '100%' }}
        focused
        id="name"
        label="Nombre"
        variant="standard"
        value={memoizedInfo && props.editable ? memoizedInfo.name : newValue?.name}
        onChange={(event) => handleChange(event.target.value, 'name')}
        aria-readonly={props.editable}
      />
    );
  };

  const displayLastName = () => {
    return (
      <CssTextFieldStandard
        sx={{ width: '100%' }}
        focused
        label="Apellido"
        variant="standard"
        value={memoizedInfo && props.editable ? memoizedInfo.lastName : newValue?.lastName}
        onChange={(event) => handleChange(event.target.value, 'lastName')}
        aria-readonly={props.editable}
      />
    );
  };

  const displayDatePicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="Fecha de nacimiento"
          maxDate={moment().format()}
          value={
            memoizedInfo && props.editable
              ? moment(memoizedInfo.birthdate).format('YYYY-MM-DD') || null
              : newValue?.birthdate
          }
          onChange={(event) => handleChange(event, 'birthdate')}
          renderInput={(params) => (
            <CssTextFieldStandard
              focused
              {...params}
              sx={{ width: '45%' }}
              variant="standard"
              label={'Fecha de nacimiento'}
              placeholder="DD/MM/YYYY"
              name="birthdate"
            />
          )}
        />
      </LocalizationProvider>
    );
  };

  const displayAge = () => {
    return (
      <CssTextFieldStandard
        sx={{ width: '20%', ml: 1 }}
        label="Edad"
        focused
        variant="standard"
        value={
          memoizedInfo && props.editable
            ? moment(moment().format()).diff(moment(memoizedInfo?.birthdate).format(), 'year')
            : moment(moment().format()).diff(moment(newValue?.birthdate).format(), 'year')
        }
        InputProps={{
          readOnly: true
        }}
      />
    );
  };

  const displayEmail = () => {
    return (
      <CssTextFieldStandard
        sx={{ width: '100%' }}
        label="Email Personal"
        variant="standard"
        focused
        value={
          memoizedInfo && props.editable ? memoizedInfo.personalEmail : newValue?.personalEmail
        }
        onChange={(event) => handleChange(event.target.value, 'personalEmail')}
        aria-readonly={props.editable}
      />
    );
  };

  const displayPhoneNumber = (contactNumberToBeDisplayed) => {
    return contactNumberToBeDisplayed?.map((phone, index) => (
      <Grid key={index}>
        <CssTextFieldStandard
          sx={{ width: '25%' }}
          id={`areaCode-${index}`}
          label="Code"
          placeholder="000"
          type="number"
          name={`areaCode-${index}`}
          variant="standard"
          size="small"
          value={phone.areaCode}
        />
        <CssTextFieldStandard
          required
          sx={{ width: '60%', ml: 1 }}
          id={`number-${index}`}
          name={`number-${index}`}
          label="Telefono de contacto"
          placeholder="0000 00000"
          type="number"
          size="small"
          variant="standard"
        />
      </Grid>
    ));
  };

  const displayDefaultCountries = (residencies, edit) => {
    return residencies?.map((residency, index) => {
      const { country } = residency;
      const countryInfo = findObject(countries, country.id);
      if (!edit) {
        return (
          <CssTextFieldStandard
            key={residency.id}
            label="Pais de residencia"
            variant="standard"
            focused
            sx={{ width: '100%' }}
            value={countryInfo ? countryInfo.name : ''}
            onChange={(event) => handleChange(event.target.value, 'name')}
            aria-readonly={props.editable}
          />
        );
      } else {
        return (
          <CustomAutoComplete
            key={index}
            name="countryId"
            label="País de residencia"
            optionList={countries}
            elmentCallback={handleCountry}
            canCreateNew={false}
            variant={true}
            prechargedValue={countryInfo}
          />
        );
      }
    });
  };

  const displayDefaultCities = (residencies, edit) => {
    return residencies?.map((residency) => {
      const { country: city } = residency;
      const cityInfo = findObject(states, city.id);
      if (!edit) {
        return (
          <CssTextFieldStandard
            key={residency.id}
            sx={{ width: '100%' }}
            label="Ciudad de residencia"
            variant="standard"
            focused
            value={cityInfo ? cityInfo.name : ''}
            aria-readonly={props.editable}
          />
        );
      } else {
        return (
          <CustomAutoComplete
            key={cityInfo.id}
            name="countryId"
            label="País de residencia"
            optionList={states}
            elmentCallback={handleCity}
            canCreateNew={false}
            variant={true}
            prechargedValue={cityInfo}
          />
        );
      }
    });
  };

  const displayAddress = (residencies) => {
    return residencies?.map((residency, index) => (
      <CssTextFieldStandard
        key={residency.id}
        label="Direccion residencial"
        focused
        sx={{ width: '100%' }}
        variant="standard"
        value={
          memoizedInfo && props.editable
            ? residency.address
            : newValue.residencies[index].address || ''
        }
        onChange={(event) => handleChangeAddress(event.target.value, `address`, index)}
        aria-readonly={props.editable}
      />
    ));
  };

  const displayNationalities = (nationalities) => {
    return nationalities?.map((nationality, index) => {
      return (
        <CustomAutoComplete
          key={index}
          name="nationalities"
          label="Nacionalididades"
          optionList={countries}
          elmentCallback={handleNationality}
          multiple={true}
          canCreateNew={false}
          variant={true}
          prechargedValue={[nationality.country]}
        />
      );
    });
  };

  const handleExecution = (execution) => {
    if (execution.status !== 200) {
      handleNewMessage({
        text: 'Por favor revisar los campos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion personal del colaborador fue editada exitosamente',
        severity: 'success'
      });
    }
  };

  const editForm = async () => {
    var execution = undefined;
    execution = await edit();
    handleExecution(execution);
    return;
  };

  const collaboratorVisualInfo = () => {
    return (
      <Grid container direction={'row'} xs={12} justifyContent={'space-between'} p={2} pt={10}>
        <Grid item xs={6} mt={1}>
          <Grid container direction={'column'} spacing={3} p={2}>
            <Grid item xs={12}>
              {displayPhoto()}
              {displayName()}
            </Grid>
            <Grid item xs={12}>
              {displayLastName()}
            </Grid>
            <Grid item xs={12}>
              {displayDatePicker()}
              {displayAge()}
            </Grid>
            <Grid item>{displayEmail()}</Grid>
            <Grid item>
              {memoizedInfo && props.editable
                ? displayPhoneNumber(memoizedInfo.contactPhones)
                : displayPhoneNumber(newValue?.contactPhones)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5} mt={1}>
          <Grid container direction={'column'} spacing={3} p={2}>
            <Grid item sx={{ width: '100%' }}>
              {memoizedInfo && props.editable
                ? displayDefaultCountries(memoizedInfo.residencies)
                : displayDefaultCountries(memoizedInfo?.residencies, true)}
            </Grid>
            <Grid item>
              {memoizedInfo && props.editable
                ? displayDefaultCities(memoizedInfo.residencies)
                : displayDefaultCities(memoizedInfo?.residencies, true)}
            </Grid>

            <Grid item>{displayAddress(memoizedInfo?.residencies)}</Grid>
            <Grid item>{displayNationalities(memoizedInfo?.nationalities)}</Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const editPersonalInformation = () => {
    return (
      <Grid pt={10}>
        <PersonalInformationStepOne formData={collaboratorInfo} ref={validationRef} />
      </Grid>
    );
  };

  useEffect(() => {
    fetchData();
    const storedInfo = JSON.parse(sessionStorage.getItem('personal'));
    if (!storedInfo) {
      getDropdownData();
    } else {
      setCollaboratorInfo(storedInfo);
    }
    ref.current = editForm;
  }, []);

  return props.editable ? collaboratorVisualInfo() : editPersonalInformation();
});
PersonalInformation.displayName = 'PersonalInformation';

export default PersonalInformation;

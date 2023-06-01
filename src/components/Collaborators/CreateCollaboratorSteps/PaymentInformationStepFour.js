import { Grid, Divider, Typography } from '@mui/material';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import { useForm } from 'react-hook-form';
import 'moment/locale/es';
import { useState, useEffect, forwardRef } from 'react';
import useEdit from 'hooks/useEdit';
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';

const ContractInformationStepFour = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm();
  const [mounted, setMounted] = useState(false);
  const { handleNewMessage } = useMessage();
  const [paymentInformation, setPaymentInformation] = useState({
    bankName: '',
    countryBank: '',
    accountNumber: undefined,
    stimatedBankTransferBill: undefined,
    officePayer: '',
    extraterritoriality: '',
    paymentPeriodicity: ''
  });
  const [edit] = useEdit('/api/collaborator', paymentInformation);

  const [offices, setOffices] = useState([]);
  const [countries, setCountries] = useState([]);

  const [paymentErrors, setPaymentErrors] = useState({});

  const getResidenceData = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/residence/countries', setCountries);
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
    setPaymentInformation({
      ...paymentInformation,
      [elementName]: selectedValue.id
    });

    setPaymentErrors({ ...paymentErrors, [elementName]: { error: false, description: '' } });
  }

  function handleOffice(office) {
    handleAutoCompleteValue(office, 'officePayer', '/api/hiring/offices', setOffices, offices);
    setPaymentInformation({
      extraterritoriality:
        paymentInformation.countryBank != paymentInformation.officePayer ? 'Si' : 'No'
    });
  }
  function handleCountry(country) {
    handleAutoCompleteValue(
      country,
      'countryBank',
      '/api/residence/countries',
      setCountries,
      countries
    );
    setPaymentInformation({
      extraterritoriality: 'Si'
    });
  }

  const handleDropdownErrors = () => {
    if (!paymentInformation.companyId || !paymentInformation.officeId || !paymentInformation.type) {
      const newErrors = {
        ...paymentErrors,
        officePayer: {
          ...(paymentInformation.officePayer ? {} : { error: true, description: 'Campo requerido' })
        },
        countryBank: {
          ...(paymentInformation.countryBank ? {} : { error: true, description: 'Campo requerido' })
        }
      };
      setPaymentErrors(newErrors);
    }
  };

  const validateForm = () => {
    handleDropdownErrors();
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const error = await edit();
        if (error) return;
        handleNewMessage({
          text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
          severity: 'success'
        });
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })();
    }
  };

  useEffect(() => {
    if (!mounted) {
      getResidenceData();
      setMounted(true);
    }
    ref.current = validateForm;
  }, [paymentInformation, mounted]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              name="bankName"
              size="small"
              label="Banco / Medio de pago"
              placeholder="Escribe tu medio de pago"
              {...register('bankName', {
                required: true,
                onChange: (event) =>
                  setPaymentInformation({
                    ...paymentInformation,
                    bankName: event.target.value
                  })
              })}
              error={errors.bankName && true}
              helperText={
                errors.bankName && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={paymentErrors.countryBank}
              name="countryId"
              label="Pais de entidad bancaria"
              optionList={countries}
              elmentCallback={handleCountry}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              required
              name="accountNumber"
              size="small"
              label="Numero de cuenta"
              {...register('accountNumber', {
                required: true,
                onChange: (event) =>
                  setPaymentInformation({
                    ...paymentInformation,
                    accountNumber: event.target.value
                  })
              })}
              error={errors.accountNumber && true}
              helperText={
                errors.accountNumber && (
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
              name="stimatedBankTransferBill"
              size="small"
              type={'number'}
              label="Estimado comision bancaria USD$"
              {...register('stimatedBankTransferBill', {
                required: true,
                onChange: (event) =>
                  setPaymentInformation({
                    ...paymentInformation,
                    stimatedBankTransferBill: event.target.value
                  })
              })}
              error={errors.stimatedBankTransferBill && true}
              helperText={
                errors.stimatedBankTransferBill && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={paymentErrors.officePayer}
              name="officeId"
              label="Oficina que fondea al recurso"
              optionList={offices}
              elmentCallback={handleOffice}
              requiredField={true}
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Extraterritorialidad"
              value={paymentInformation.extraterritoriality}
              InputProps={{
                readOnly: true
              }}
              size="small"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              size="small"
              label="Periodicidad de pago"
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

ContractInformationStepFour.displayName = 'ContractInformationStepFour';
export default ContractInformationStepFour;

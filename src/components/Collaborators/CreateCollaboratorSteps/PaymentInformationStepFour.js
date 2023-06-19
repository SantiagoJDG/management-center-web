import { Divider, Grid, Typography } from '@mui/material';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAxiosInstance } from 'utils/axiosClient';
import { CssTextField } from '../../../styles/formButton';
import CustomAutoComplete from 'components/CustomAutoComplete';

import { getDataInformation } from '../../../utils/dataUtils';
import useMessage from 'hooks/useMessage';
import useCreate from 'hooks/useCreate';

const ContractInformationStepFour = forwardRef((props, ref) => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();
  const [mounted, setMounted] = useState(false);
  const { handleNewMessage } = useMessage();
  const [extraterritoriality, setExtraterritoriality] = useState(false);
  const [paymentInformation, setPaymentInformation] = useState({
    bankId: '',
    bankCountryId: 0,
    accountNumber: undefined,
    commissionAmount: undefined,
    officePayerId: '',
    frequencyId: ''
  });

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/payment-information`,
    paymentInformation,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  const [offices, setOffices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [frequencies, setFrequencies] = useState([]);

  const [paymentErrors, setPaymentErrors] = useState({});

  const getCatalogs = async () => {
    getDataInformation('/api/hiring/offices', setOffices);
    getDataInformation('/api/residence/countries', setCountries);
    getDataInformation('/api/hiring/frequencies', setFrequencies);
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
    if (paymentInformation.bankCountryId != office.id) {
      setExtraterritoriality(true);
    }

    handleAutoCompleteValue(office, 'officePayerId', '/api/hiring/offices', setOffices, offices);
  }

  function handleFrequency(frequency) {
    handleAutoCompleteValue(
      frequency,
      'frequencyId',
      '/api/hiring/frequency',
      setFrequencies,
      frequencies
    );
  }
  function handleBankCountry(country) {
    setPaymentInformation({
      ...paymentInformation,
      extraterritoriality: country.id != paymentInformation.officePayerId
    });

    handleAutoCompleteValue(
      country,
      'bankCountryId',
      '/api/residence/countries',
      setCountries,
      countries
    );
  }

  const handleDropdownErrors = () => {
    if (!paymentInformation.companyId || !paymentInformation.officeId || !paymentInformation.type) {
      const newErrors = {
        ...paymentErrors,
        officePayerId: {
          ...(paymentInformation.officePayerId
            ? {}
            : { error: true, description: 'Campo requerido' })
        },
        bankCountryId: {
          ...(paymentInformation.bankCountryId
            ? {}
            : { error: true, description: 'Campo requerido' })
        }
      };
      setPaymentErrors(newErrors);
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

  useEffect(() => {
    if (!mounted) {
      getCatalogs();
      setMounted(true);
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
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
              name="bankId"
              size="small"
              label="Banco / Medio de pago"
              placeholder="Escribe tu medio de pago"
              {...register('bankId', {
                required: true,
                onChange: (event) => {
                  setPaymentInformation({
                    ...paymentInformation,
                    bankId: event.target.value
                  });
                }
              })}
              error={errors.bankId && true}
              helperText={
                errors.bankId && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={paymentErrors.bankCountryId}
              name="bankCountryId"
              label="Pais de entidad bancaria"
              optionList={countries}
              elmentCallback={handleBankCountry}
              requiredField={true}
              canCreateNew={false}
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
              name="commissionAmount"
              size="small"
              type={'number'}
              label="Estimado comision bancaria USD$"
              {...register('commissionAmount', {
                required: true,
                onChange: (event) =>
                  setPaymentInformation({
                    ...paymentInformation,
                    commissionAmount: event.target.value
                  })
              })}
              error={errors.commissionAmount && true}
              helperText={
                errors.commissionAmount && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <CustomAutoComplete
              formError={paymentErrors.officePayerId}
              name="officeId"
              label="Oficina que fondea al recurso"
              optionList={offices}
              elmentCallback={handleOffice}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Extraterritorialidad"
              value={extraterritoriality ? 'Si' : 'No'}
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
            <CustomAutoComplete
              formError={paymentErrors.frequencyId}
              name="frequencyId"
              label="Periodicidad de pago"
              optionList={frequencies}
              elmentCallback={handleFrequency}
              requiredField={true}
              canCreateNew={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

ContractInformationStepFour.displayName = 'ContractInformationStepFour';
export default ContractInformationStepFour;

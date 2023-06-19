import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Typography
} from '@mui/material';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CssSelectInput, CssTextField } from '../../../styles/formButton';
import { getDataInformation } from '../../../utils/dataUtils';

const BillingInformationStepFive = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();

  const [mounted, setMounted] = useState(false);
  const [calculationRegimes, setCalculationRegimes] = useState([]);
  const [periodicities, setPeriodicities] = useState([]);
  const [compensationTypes, setCompensationTypes] = useState([]);
  const [currency] = useState({ name: 'USD', valueAmount: 1 });

  const [billingInformation, setBillingInformation] = useState({
    calculationRegimeId: '',
    healthInsurance: false,
    healthInsuranceAmount: 0,
    compensationTypeId: '',
    compensationAmount: '',
    compensationPeriodicityId: '',
    compensationDuration: ''
  });

  const [informationForm, setInformationForm] = useState({
    baseFeeUSD: '',
    calculationRegime: '',
    anualCalculatedRegimeBase: '',
    compensationType: '',
    compensationPeriodicity: '',
    anualCalculatedCompensation: ''
  });

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/compensation-information`,
    billingInformation
  );

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const getInitialData = () => {
    getDataInformation('/api/hiring/calculation-regimes', setCalculationRegimes);
    getDataInformation('/api/hiring/periodicities', setPeriodicities);
    getDataInformation('/api/hiring/compensation-types', setCompensationTypes);
    getDataInformation(
      `/api/collaborator/${props.newCollaboratorId}/contract`,
      calculateBaseAmountUSD
    );
  };

  const calculateBaseAmountUSD = (collaboratorContract) => {
    const { baseAmount } = collaboratorContract;
    informationForm.baseFeeUSD = baseAmount * currency.valueAmount;
  };

  const handleCompensationTypeId = (event) => {
    const {
      target: { value }
    } = event;
    setInformationForm({
      ...informationForm,
      compensationType: value
    });

    setBillingInformation({
      ...billingInformation,
      compensationTypeId: value.id
    });
  };

  const handleCalculationRegimeId = (event) => {
    const {
      target: { value }
    } = event;

    setInformationForm({
      ...informationForm,
      calculationRegime: value,
      anualCalculatedRegimeBase: value.compensationFactor * informationForm.baseFeeUSD
    });

    setBillingInformation({
      ...billingInformation,
      calculationRegimeId: value.id
    });
  };

  const handlePeriodicityId = (event) => {
    const {
      target: { value }
    } = event;

    console.log(value);

    setInformationForm({
      ...informationForm,
      compensationPeriodicity: value
    });

    setBillingInformation({
      ...billingInformation,
      compensationPeriodicityId: value.id
    });
  };

  const handleDuration = (event) => {
    setBillingInformation({
      ...billingInformation,
      compensationDuration: Number(event.target.value)
    });

    setInformationForm({
      ...informationForm,
      anualCalculatedCompensation:
        billingInformation.compensationAmount *
        informationForm.compensationPeriodicity.value *
        Number(event.target.value)
    });
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
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const response = await create();
        afterExecution(response);
      })();
    }
  };

  function getTotalAnualFee() {
    let response = 0;

    if (informationForm.anualCalculatedRegimeBase) {
      response = response + Number(informationForm.anualCalculatedRegimeBase);
    }

    if (informationForm.anualCalculatedCompensation) {
      response = response + Number(informationForm.anualCalculatedCompensation);
    }

    if (billingInformation.healthInsuranceAmount) {
      response = response + Number(billingInformation.healthInsuranceAmount);
    }

    return Math.round(response, 3);
  }

  function getTotalAnualyHourFee() {
    let response = getTotalAnualFee();
    response = response / 12;
    response = response / 160;
    return Math.round(response, 3);
  }

  useEffect(() => {
    if (!mounted) {
      getInitialData();
      setMounted(true);
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }
    ref.current = validateForm;
  }, [billingInformation]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5} mt={1}>
        <Grid container direction={'column'} spacing={3} p={2}>
          <Grid item>
            <CssTextField
              label="Tarifa base en USD$"
              type="number"
              name={'baseFeeUSD'}
              sx={{ width: '100%' }}
              variant="outlined"
              size="small"
              value={informationForm.baseFeeUSD}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%', borderColor: '#2196f3' }}>
              <InputLabel id="calculationRegimeLabel" error={errors.calculationRegimeId}>
                Regimen de calculo
              </InputLabel>
              <CssSelectInput
                value={informationForm.calculationRegime}
                id="calculationRegimeId"
                label="Regimen de calculo"
                error={errors.calculationRegimeId}
                {...register('calculationRegimeId', {
                  required: true,
                  onChange: handleCalculationRegimeId
                })}
              >
                {calculationRegimes.map((type) => {
                  return (
                    <MenuItem key={type.id} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.calculationRegimeId && <FormHelperText error>Campo requerido</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item>
            <InputLabel id="calculatation">Factor de compensacion</InputLabel>
            <CssTextField
              sx={{ width: '20%' }}
              value={informationForm.calculationRegime.compensationFactor}
              size="small"
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa con factor de compensacion. Anual"
              size="small"
              value={informationForm.anualCalculatedRegimeBase + '$'}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%', borderColor: '#2196f3' }}>
              <InputLabel id="compensationTypeIdLabel" error={errors.compensationTypeId}>
                Compensacion complementaria
              </InputLabel>
              <CssSelectInput
                value={informationForm.compensationType}
                id="compensationTypeId"
                label="Compensacion complementaria"
                error={errors.compensationTypeId}
                {...register('compensationTypeId', {
                  required: true,
                  onChange: handleCompensationTypeId
                })}
              >
                {compensationTypes.map((type) => {
                  return (
                    <MenuItem key={type.id} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.compensationTypeId && <FormHelperText error>Campo requerido</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item>
            <CssTextField
              required
              label="Target USD$ CC. Mensual"
              placeholder="0.00$"
              sx={{ width: '85%' }}
              type="number"
              name={'compensationAmount'}
              variant="outlined"
              size="small"
              value={billingInformation.compensationAmount}
              {...register('compensationAmount', {
                required: true,
                onChange: (event) =>
                  setBillingInformation({
                    ...billingInformation,
                    compensationAmount: Number(event.target.value)
                  })
              })}
              error={errors.compensationAmount}
              helperText={
                errors.compensationAmount && (
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
                id="periodicity"
                error={errors.periodicity && !informationForm.compensationPeriodicity}
              >
                Periodicidad
              </InputLabel>
              <CssSelectInput
                labelId="periodicity"
                label="Periodicidad"
                id="periodicity"
                value={informationForm.compensationPeriodicity}
                error={errors.compensationPeriodicityId && !informationForm.compensationPeriodicity}
                {...register('compensationPeriodicityId', {
                  required: true,
                  onChange: handlePeriodicityId
                })}
              >
                {periodicities.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.compensationPeriodicityId && !informationForm.compensationPeriodicity && (
                <FormHelperText error>Campo requerido</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <CssTextField
              required
              label="Duracion"
              sx={{ width: '100%' }}
              placeholder="Duracion de compensacion"
              type="number"
              name={'compensationDuration'}
              variant="outlined"
              size="small"
              value={billingInformation.compensationDuration}
              onChange={handleDuration}
              error={errors.compensationDuration}
              helperText={
                errors.compensationDuration && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                )
              }
            />
          </Grid>
          <Grid item>
            <InputLabel id="calculatation">Compensacion complementaria Anual USD$</InputLabel>
            <CssTextField
              sx={{ width: '80%' }}
              size="small"
              value={informationForm.anualCalculatedCompensation + ' $'}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Grid container direction={'row'} spacing={1}>
              <Grid item xs={6}>
                <FormControl size="small" sx={{ width: '100%' }}>
                  <InputLabel
                    id="insurance"
                    error={errors.insurance && !billingInformation.insurance}
                  >
                    Seguro Medico{' '}
                  </InputLabel>
                  <CssSelectInput
                    labelId="insurance"
                    id="insurance"
                    label="Seguro Medico"
                    value={billingInformation.healthInsurance}
                    error={errors.insurance && !billingInformation.healthInsurance}
                    {...register('healthInsurance', {
                      required: true,
                      onChange: (event) =>
                        setBillingInformation({
                          ...billingInformation,
                          healthInsurance: event.target.value
                        })
                    })}
                  >
                    <MenuItem value={true}>Si</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </CssSelectInput>
                  {errors.healthInsurance && !billingInformation.healthInsurance && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <CssTextField
                  sx={{ width: '100%' }}
                  label="Monto de subsidio SM. Anual"
                  placeholder="0.00$"
                  type="number"
                  name={'healthInsuranceAmount'}
                  variant="outlined"
                  size="small"
                  value={billingInformation.healthInsuranceAmount}
                  {...register('healthInsuranceAmount', {
                    onChange: (event) =>
                      setBillingInformation({
                        ...billingInformation,
                        healthInsuranceAmount: event.target.value
                      })
                  })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa total Anual"
              size="small"
              value={getTotalAnualFee()}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Trifa por Hora"
              size="small"
              value={getTotalAnualyHourFee()}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

BillingInformationStepFive.displayName = 'BillingInformationStepFive';
export default BillingInformationStepFive;

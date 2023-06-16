import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Typography
} from '@mui/material';
import useEdit from 'hooks/useEdit';
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
  const [frequencies, setFrequencies] = useState([]);
  const [collaboratorContract, setCollaboratorContract] = useState({});
  const [currency, setCurrency] = useState({ name: 'USD', valueAmount: 1 });
  const [anualFee, setAnualFee] = useState(0);

  const [edit] = useEdit('/api/collaborator');

  const [calculationRegime, setCalculationRegime] = useState('');
  const [periodicityValue, setPeriodicityValue] = useState('');
  const [durationValue, setDurationValue] = useState('');

  const [billingInformation, setBillingInformation] = useState({
    baseFeeUSD: '',
    calculatation: '',
    calculationFee: '',
    complementFee: '0.00$',
    usdMonthlyFee: '',
    periodicity: '',
    duration: '',
    usdAnualComplementFee: '0.00',
    insurance: '',
    insuranceFee: '',
    anualTotal: '',
    hourFee: ''
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm();

  const getInitialData = () => {
    getDataInformation('/api/hiring/calculation-regimes', setCalculationRegimes);
    getDataInformation('/api/hiring/frequencies', setFrequencies);
    getDataInformation(
      `/api/collaborator/${props.newCollaboratorId}/contract`,
      calculateBaseAmountUSD
    );
  };

  const calculateBaseAmountUSD = (collaboratorContract) => {
    setCollaboratorContract(collaboratorContract);
    const { baseAmount } = collaboratorContract;
    billingInformation.baseFeeUSD = baseAmount * currency.valueAmount;
  };

  const handleSelectValue = (selectedValue, elementName) => {
    if (!selectedValue) return;
    setBillingInformation({
      ...billingInformation,
      periodicity: selectedValue[elementName]
    });
  };

  const calculateFee = (calculationType, usdBaseFee) => {
    const anualFee = calculationType * usdBaseFee;
    return setBillingInformation({ ...billingInformation, calculationFee: anualFee });
  };

  const calculateComplementFee = (usdMonthlyFee, periodicity, duration) => {
    const anualComplementFee = usdMonthlyFee * periodicity * duration;
    return setBillingInformation({
      ...billingInformation,
      usdAnualComplementFee: anualComplementFee
    });
  };

  const handleCalculationRegimeId = (event) => {
    const {
      target: { value }
    } = event;
    console.log(value);
    setCalculationRegime(value);

    setBillingInformation({
      ...billingInformation,
      calculationRegimeId: value.id
    });

    setAnualFee(value.compensationFactor * billingInformation.baseFeeUSD);
  };

  const handlePeriodicity = (event) => {
    const {
      target: { value }
    } = event;
    const periodicityType = value;
    setPeriodicityValue(value);
    handleSelectValue(periodicityType, 'id');
  };

  const handleDuration = (event) => {
    setDurationValue(event.target.value);
    calculateComplementFee(
      billingInformation.usdMonthlyFee,
      billingInformation.periodicity,
      event.target.value
    );
  };

  const validateForm = () => {
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const error = await edit();
        if (error) return;
        handleNewMessage({
          text: 'Excelente! La Informacion de pago fué creada exitosamente',
          severity: 'success'
        });
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })();
    }
  };

  useEffect(() => {
    if (!mounted) {
      getInitialData();
      setMounted(true);
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
              value={billingInformation.baseFeeUSD}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%', borderColor: '#2196f3' }}>
              <InputLabel id="calculatation" error={errors.calculatation && !item}>
                Regimen de calculo
              </InputLabel>
              <CssSelectInput
                value={calculationRegime}
                labelId="calculationRegimeId"
                id="calculationRegimeId"
                label="Regimen de calculo"
                error={errors.calculatation && !item}
                {...register('calculationRegimeId', {
                  required: true,
                  onChange: handleCalculationRegimeId
                })}
              >
                {calculationRegimes.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.calculationRegimeId && !item && (
                <FormHelperText error>Campo requerido</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <InputLabel id="calculatation">Factor de compensacion</InputLabel>
            <CssTextField
              sx={{ width: '20%' }}
              value={calculationRegime.compensationFactor}
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
              value={anualFee + '$'}
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              size="small"
              label="Compensacion complementaria"
              value={billingInformation.complementFee}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              required
              label="Target USD$ CC. Mensual"
              placeholder="0.00$"
              sx={{ width: '85%' }}
              type="number"
              name={'usdMonthlyFee'}
              variant="outlined"
              size="small"
              value={billingInformation.usdMonthlyFee}
              {...register('usdMonthlyFee', {
                required: true,
                onChange: (event) =>
                  setBillingInformation({
                    ...billingInformation,
                    usdMonthlyFee: event.target.value
                  })
              })}
              error={errors.usdMonthlyFee}
              helperText={
                errors.usdMonthlyFee && (
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
              <InputLabel id="periodicity" error={errors.periodicity && !periodicityValue}>
                Periodicidad
              </InputLabel>
              <CssSelectInput
                labelId="periodicity"
                label="Periodicidad"
                id="periodicity"
                value={periodicityValue}
                onChange={handlePeriodicity}
                error={errors.periodicity && !periodicityValue}
                {...register('periodicity', { required: true, onChange: handlePeriodicity })}
              >
                {frequencies.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
              {errors.periodicity && !periodicityValue && (
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
              name={'duration'}
              variant="outlined"
              size="small"
              value={durationValue}
              onChange={handleDuration}
              error={errors.duration}
              helperText={
                errors.duration && (
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
              value={billingInformation.usdAnualComplementFee + ' $'}
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
                    value={billingInformation.insurance}
                    error={errors.insurance && !billingInformation.insurance}
                    {...register('insurance', {
                      required: true,
                      onChange: (event) =>
                        setBillingInformation({
                          ...billingInformation,
                          insurance: event.target.value
                        })
                    })}
                  >
                    <MenuItem value={'Si'}>Si</MenuItem>
                    <MenuItem value={'No'}>No</MenuItem>
                  </CssSelectInput>
                  {errors.insurance && !billingInformation.insurance && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <CssTextField
                  required
                  sx={{ width: '100%' }}
                  label="Monto de subsidio SM. Anual"
                  placeholder="0.00$"
                  type="number"
                  name={'insuranceFee'}
                  variant="outlined"
                  size="small"
                  value={billingInformation.insuranceFee}
                  error={errors.insuranceFee}
                  {...register('insuranceFee', {
                    required: true,
                    onChange: (event) =>
                      setBillingInformation({
                        ...billingInformation,
                        insuranceFee: event.target.value
                      })
                  })}
                  helperText={
                    errors.insuranceFee && (
                      <Typography variant="caption" color="error">
                        Campo requerido
                      </Typography>
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa total Anual"
              size="small"
              value={billingInformation.insuranceFee + billingInformation.usdMonthlyFee + ' $'}
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
              value={
                Math.round(
                  ((billingInformation.insuranceFee + billingInformation.anualTotal) / 52) * 40
                ) + ' $'
              }
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

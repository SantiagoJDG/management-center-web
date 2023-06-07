import { Grid, Divider, MenuItem, FormControl, InputLabel } from '@mui/material';
// import CustomAutoComplete from 'components/CustomAutoComplete';
// import { getAxiosInstance } from 'utils/axiosClient';
import { useForm } from 'react-hook-form';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import useEdit from 'hooks/useEdit';
import { CssTextField, CssSelectInput } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';

const calculationTypes = [
  { id: 1, name: 'HP' },
  { id: 2, name: 'Pasantias' },
  { id: 3, name: 'Laboral' },
  { id: 4, name: 'PTY' },
  { id: 5, name: 'HP Temporal' },
  { id: 6, name: 'Confidencial' },
  { id: 7, name: 'Lideres' }
];

const periodicityTypes = [
  { id: 1, name: 'Mensual' },
  { id: 2, name: 'Trimestral' },
  { id: 3, name: 'Anual' }
];

const BillingInformationStepFive = forwardRef((props, ref) => {
  const [mounted, setMounted] = useState(false);
  const { handleNewMessage } = useMessage();
  const [calculationFeeDisplay, setCalculationFeeDisplay] = useState(1);
  const [edit] = useEdit('/api/collaborator');

  const [item, setItem] = useState('');
  const [periodicityValue, setPeriodicityValue] = useState('');
  const [durationValue, setDurationValue] = useState('');

  const [billingInformation, setBillingInformation] = useState({
    usdBaseFee: '',
    calculatation: '',
    calculationFee: '',
    complementFee: '0.00$',
    usdMonthlyFee: '',
    periodicity: '',
    duration: '',
    usdAnualComplementFee: '',
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

  const handleCalculation = (event) => {
    const {
      target: { value }
    } = event;
    setItem(value);
    const calculatationType = value;
    handleSelectValue(calculatationType, 'id');
    setCalculationFeeDisplay(calculatationType.id);
    calculateFee(calculatationType.id, billingInformation.usdBaseFee);
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
          text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
          severity: 'success'
        });
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })();
    }
  };

  useEffect(() => {
    if (!mounted) {
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
              required
              label="Tarifa base en USD$"
              placeholder="Escribe la tarifa base en USD$"
              type="number"
              name={'usdBaseFee'}
              sx={{ width: '100%' }}
              variant="outlined"
              size="small"
              value={billingInformation.usdBaseFee}
              {...register('usdBaseFee', {
                required: true,
                onChange: (event) => {
                  setBillingInformation({ ...billingInformation, usdBaseFee: event.target.value });
                }
              })}
              error={errors.usdBaseFee}
            />
          </Grid>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%', borderColor: '#2196f3' }}>
              <InputLabel id="calculatation">Regimen de calculo</InputLabel>
              <CssSelectInput
                value={item}
                labelId="calculatation"
                id="calculatation"
                label="Regimen de calculo"
                onChange={handleCalculation}
              >
                {calculationTypes.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
            </FormControl>
          </Grid>
          <Grid item>
            <InputLabel id="calculatation">Factor de compensacion</InputLabel>
            <CssTextField
              sx={{ width: '20%' }}
              value={calculationFeeDisplay}
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
              value={billingInformation.calculationFee + '$'}
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
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              required
              label="Target USD$ CC. Mensual"
              placeholder="0.00$"
              sx={{ width: '100%' }}
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
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <Grid item>
            <FormControl size="small" sx={{ width: '100%' }}>
              <InputLabel id="periodicity">Periodicidad</InputLabel>
              <CssSelectInput
                labelId="periodicity"
                label="Periodicidad"
                id="periodicity"
                value={periodicityValue}
                onChange={handlePeriodicity}
              >
                {periodicityTypes.map((type, index) => {
                  return (
                    <MenuItem key={index} value={type}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </CssSelectInput>
            </FormControl>
          </Grid>
          <Grid item>
            <CssTextField
              required
              label="Duracion"
              placeholder="Duracion de compensacion"
              type="number"
              name={'duration'}
              variant="outlined"
              size="small"
              value={durationValue}
              onChange={handleDuration}
              error={errors.duration}
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              size="small"
              label="Compensacion complementaria"
              value={billingInformation.usdAnualComplementFee}
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
                  <InputLabel id="insurance">Seguro Medico </InputLabel>
                  <CssSelectInput
                    labelId="insurance"
                    id="insurance"
                    label="Seguro Medico"
                    value={billingInformation.insurance}
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
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <CssTextField
                  required
                  sx={{ width: '100%' }}
                  label="Monto de subsidio SM. Anual"
                  placeholder="0.00$"
                  type="number"
                  name={'duration'}
                  variant="outlined"
                  size="small"
                  value={billingInformation.insuranceFee}
                  {...register('duration', {
                    required: true,
                    onChange: (event) =>
                      setBillingInformation({
                        ...billingInformation,
                        insuranceFee: event.target.value
                      })
                  })}
                  error={errors.duration}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa total Anual"
              size="small"
              value={billingInformation.insuranceFee + billingInformation.anualTotal + ' $'}
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
                ((billingInformation.insuranceFee + billingInformation.anualTotal) / 52) * 40 + ' $'
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

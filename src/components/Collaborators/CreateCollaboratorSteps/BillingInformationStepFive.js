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
import useEdit from 'hooks/useEdit';
import useMessage from 'hooks/useMessage';
import 'moment/locale/es';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CssSelectInput, CssTextField } from '../../../styles/formButton';
import { getDataInformation } from '../../../utils/dataUtils';
import CustomAutoComplete from 'components/CustomAutoComplete';

const BillingInformationStepFive = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();

  const [mounted, setMounted] = useState(false);
  const [calculationRegimes, setCalculationRegimes] = useState([]);
  const [periodicities, setPeriodicities] = useState([]);
  const [compensationTypes, setCompensationTypes] = useState([]);
  const [currency] = useState({ name: 'USD', valueAmount: 1 });
  const [formErrors, setFormErrors] = useState({});

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

  const [edit] = useEdit(
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
    handleAutoCompleteValue(event, 'compensationTypeId');
    setInformationForm({
      ...informationForm,
      compensationType: event
    });
  };

  function handleCalculationRegimeId(value) {
    handleAutoCompleteValue(value, 'calculationRegimeId');
    setInformationForm({
      ...informationForm,
      calculationRegime: value,
      anualCalculatedRegimeBase: value.compensationFactor * informationForm.baseFeeUSD
    });
  }

  const handlePeriodicityId = (value) => {
    handleAutoCompleteValue(value, 'compensationPeriodicityId');
    setInformationForm({
      ...informationForm,
      compensationPeriodicity: value
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
      props.rememberStepFormInformation(props.stepName, billingInformation);
    }
  };

  const validateForm = () => {
    let response = undefined;
    const isValid = trigger();
    handleDropdownErrors();
    if (isValid) {
      handleSubmit(async () => {
        Object.keys(props.formData).length
          ? (response = await edit())
          : (response = await create());
        afterExecution(response);
      })();
    }
  };

  function getTotalAnualFee(
    anualCalculatedRegimeBase,
    anualCalculatedCompensation,
    healthInsuranceAmount
  ) {
    let response = 0;

    if (anualCalculatedRegimeBase) {
      response = response + Number(anualCalculatedRegimeBase);
    }

    if (anualCalculatedCompensation) {
      response = response + Number(anualCalculatedCompensation);
    }

    if (healthInsuranceAmount) {
      response = response + Number(healthInsuranceAmount);
    }

    return Math.round(response, 3);
  }

  function getTotalAnualyHourFee() {
    let response = Object.keys(props.formData).length
      ? getTotalAnualFee(
          calculateDefaultAnualRegimeBase(),
          calculateDefaultAnualCompensation(),
          props.formData.healthInsuranceAmount
        )
      : getTotalAnualFee(
          informationForm.anualCalculatedRegimeBase,
          informationForm.anualCalculatedCompensation,
          billingInformation.healthInsuranceAmount
        );
    response = response / 12;
    response = response / 160;
    return Math.round(response, 3);
  }

  const calculateDefaultAnualCompensation = () => {
    const { calculationRegimeId, compensationAmount, compensationPeriodicityId } = props.formData;

    const defaultPeriodicityValue = findObject(periodicities, compensationPeriodicityId);
    const anualCalculatedCompensation =
      compensationAmount * calculationRegimeId * defaultPeriodicityValue?.value;

    return Math.round(anualCalculatedCompensation);
  };

  const calculateDefaultAnualRegimeBase = () => {
    const { calculationRegimeId, compensationAmount } = props.formData;

    const defaultCalculationRegime = findObject(calculationRegimes, calculationRegimeId);
    const anualCalculatedRegimeBase =
      compensationAmount * defaultCalculationRegime?.compensationFactor;

    return Math.round(anualCalculatedRegimeBase);
  };

  async function handleAutoCompleteValue(selectedValue, elementName) {
    if (!selectedValue) return;

    setBillingInformation({
      ...billingInformation,
      [elementName]: selectedValue.id
    });

    setFormErrors({
      ...formErrors,
      [elementName]: { error: false, description: '' }
    });
  }
  const handleDropdownErrors = () => {
    if (
      !billingInformation.calculationRegimeId ||
      !billingInformation.compensationTypeId ||
      !billingInformation.compensationPeriodicityId
    ) {
      const newErrors = {
        ...formErrors,
        calculationRegimeId: {
          ...(billingInformation.calculationRegimeId
            ? {}
            : { error: true, description: 'Campo requerido' })
        },
        compensationTypeId: {
          ...(billingInformation.compensationTypeId
            ? {}
            : { error: true, description: 'Campo requerido' })
        },
        compensationPeriodicityId: {
          ...(billingInformation.compensationPeriodicityId
            ? {}
            : { error: true, description: 'Campo requerido' })
        }
      };
      setFormErrors(newErrors);
    }
  };

  const displayCalculusRegime = () => {
    const defaultCalculationRegime = findObject(
      calculationRegimes,
      props.formData.calculationRegimeId
    );
    const defaultValue = defaultCalculationRegime ? defaultCalculationRegime : '';

    return (
      <CustomAutoComplete
        formError={formErrors.calculationRegimeId}
        name="calculationRegimeId"
        label="Regimen de calculo"
        optionList={calculationRegimes}
        elmentCallback={handleCalculationRegimeId}
        requiredField={true}
        canCreateNew={false}
        prechargedValue={
          informationForm.calculationRegime ? informationForm.calculationRegime : defaultValue
        }
      />
    );
  };

  const displayCompensationType = () => {
    const defaultCompensationType = findObject(
      compensationTypes,
      props.formData.compensationTypeId
    );
    const defaultValue = defaultCompensationType ? defaultCompensationType : '';

    return (
      <CustomAutoComplete
        formError={formErrors.compensationTypeId}
        name="compensationTypeId"
        label="Compensacion complementaria"
        optionList={compensationTypes}
        elmentCallback={handleCompensationTypeId}
        requiredField={true}
        canCreateNew={false}
        prechargedValue={
          informationForm.compensationType ? informationForm.compensationType : defaultValue
        }
      />
    );
  };

  const displayFactor = () => {
    const defaultCalculationRegime = findObject(
      calculationRegimes,
      props.formData.calculationRegimeId
    );
    const defaultValue = defaultCalculationRegime ? defaultCalculationRegime : '';
    return (
      <>
        <InputLabel id="calculatation">Factor de compensacion</InputLabel>
        <CssTextField
          sx={{ width: '20%' }}
          value={
            informationForm.calculationRegime.compensationFactor
              ? informationForm.calculationRegime.compensationFactor
              : defaultValue.compensationFactor
          }
          size="small"
          InputProps={{
            readOnly: true
          }}
          variant="outlined"
        />
      </>
    );
  };

  const displayPeriodicity = () => {
    const defaultPeriodicity = findObject(periodicities, props.formData.compensationPeriodicityId);
    const defaultValue = defaultPeriodicity ? defaultPeriodicity : '';
    return (
      <CustomAutoComplete
        formError={formErrors.compensationPeriodicityId}
        name="compensationPeriodicityId"
        label="Periodicidad"
        optionList={periodicities}
        elmentCallback={handlePeriodicityId}
        requiredField={true}
        canCreateNew={false}
        prechargedValue={
          informationForm.compensationPeriodicity
            ? informationForm.compensationPeriodicity
            : defaultValue
        }
      />
    );
  };

  const findObject = (array, id) => array.find((each) => each.id === id);

  useEffect(() => {
    if (!mounted) {
      getInitialData();
      setMounted(true);
      if (Object.keys(props.formData).length) {
        const { formData } = props;
        setBillingInformation(formData);
        props.setFormCompleted(true);
        setInformationForm({
          ...informationForm,
          anualCalculatedCompensation: calculateDefaultAnualCompensation(),
          anualCalculatedRegimeBase: calculateDefaultAnualRegimeBase()
        });
      }
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }

    ref.current = validateForm;
  }, [billingInformation, informationForm]);

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
              value={
                informationForm.baseFeeUSD
                  ? informationForm.baseFeeUSD
                  : billingInformation.compensationAmount
              }
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item>{displayCalculusRegime()}</Grid>
          <Grid item>{displayFactor()}</Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa con factor de compensacion. Anual"
              size="small"
              value={
                Object.keys(props.formData).length
                  ? calculateDefaultAnualRegimeBase()
                  : informationForm.anualCalculatedRegimeBase
              }
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>{displayCompensationType()}</Grid>
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
          <Grid item>{displayPeriodicity()}</Grid>
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
              value={
                Object.keys(props.formData).length
                  ? calculateDefaultAnualCompensation()
                  : informationForm.anualCalculatedCompensation
              }
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
              value={
                Object.keys(props.formData).length
                  ? getTotalAnualFee(
                      calculateDefaultAnualRegimeBase(),
                      calculateDefaultAnualCompensation(),
                      props.formData.healthInsuranceAmount
                    )
                  : getTotalAnualFee(
                      informationForm.anualCalculatedRegimeBase,
                      informationForm.anualCalculatedCompensation,
                      billingInformation.healthInsuranceAmount
                    )
              }
              InputProps={{
                readOnly: true
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <CssTextField
              sx={{ width: '100%' }}
              label="Tarifa por Hora"
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

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CardMedia, Divider, Grid, ListItemIcon, Typography } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CssTextField } from '../../../styles/formButton';
import { getDataInformation } from '../../../utils/dataUtils';

const RateIncreaseStepSix = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();

  const [rateIncrease, setRateIncrease] = useState({
    effectiveDate: '',
    amount: ''
  });
  const [isMounted, setIsMounted] = useState(false);
  const [numbeRateIncrease, setNumberRateIncrease] = useState([{ rateIncreasePercentage: '' }]);
  const [newBaseAmount, setNewBaseAmount] = useState();
  const [collaboratorContract, setCollaboratorContract] = useState({ id: 0 });

  const [rateIncreaseData, setRateIncreaseData] = useState({
    percentage: [],
    effectiveDate: '',
    amount: ''
  });
  const secondTextFieldRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const [create] = useCreate(
    `/api/collaborator/${props.newCollaboratorId}/contract/${collaboratorContract.id}/fare-increase`,
    rateIncrease
  );

  const handleAddNumberRateIncrease = () => {
    setNumberRateIncrease([...numbeRateIncrease, { rateIncreasePercentage: '' }]);
  };

  const handleNumberRateChange = (event, index) => {
    const percentageValue = (collaboratorContract.baseAmount * event.target.value) / 100;
    const newBaseAmount = collaboratorContract.baseAmount + percentageValue;

    const newNumberRatePercentage = [...numbeRateIncrease];
    newNumberRatePercentage[index] = {
      ...newNumberRatePercentage[index],
      rateIncreasePercentage: event.target.value * collaboratorContract.baseAmount
    };

    setNewBaseAmount(newBaseAmount);

    setRateIncrease({
      ...rateIncrease,
      amount: event.target.value
    });

    setRateIncreaseData({
      ...rateIncreaseData,
      amount: newBaseAmount,
      percentage: newNumberRatePercentage
    });
  };

  const handleNEffectiveDate = (date) => {
    setRateIncrease({
      ...rateIncrease,
      effectiveDate: date
    });
    setRateIncreaseData({
      ...rateIncreaseData,
      effectiveDate: date
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
        text: 'Excelente! La Informacion de incremento de tarifa fue creada exitosamente',
        severity: 'success'
      });

      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      props.setFormCompleted(false);
      props.rememberStepFormInformation(props.stepName, rateIncreaseData);
    }
  };

  const validateForm = () => {
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const execution = await create();
        afterExecution(execution);
      })();
    }
  };

  const getCollaboratorContract = async () => {
    getDataInformation(
      `/api/collaborator/${props.newCollaboratorId}/contract`,
      setCollaboratorContract
    );
  };

  const renderPercertanges = (numberRateIncrease) => {
    return numberRateIncrease.map((Rate, index) => (
      <Grid item key={`number-${index}`}>
        <CssTextField
          required
          id={`number-${index}`}
          name={`number-${index}`}
          label="Porcentaje de incremento de tarifa"
          placeholder="%0.00"
          type="number"
          size="small"
          fullWidth
          inputProps={{
            min: 1,
            max: 100
          }}
          variant="outlined"
          inputRef={secondTextFieldRef}
          value={Object.keys(props.formData).length ? Rate.rateIncreasePercentage : Rate.number}
          {...register(`number-${index}`, {
            required: true,
            onChange: (event) => handleNumberRateChange(event, index)
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
        <Grid sx={{ pl: 2, pt: 1 }}></Grid>
      </Grid>
    ));
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      getCollaboratorContract();
    }

    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }
    if (Object.keys(props.formData).length) {
      const { formData } = props;
      setNewBaseAmount(formData.amount);
    }
    ref.current = validateForm;
  }, [rateIncrease]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={4} p={2}>
          <Grid item>
            {Object.keys(props.formData).length
              ? renderPercertanges(props.formData.percentage)
              : renderPercertanges(numbeRateIncrease)}
          </Grid>

          <Grid item>
            <CssTextField
              size="small"
              label="Nueva tarifa USD$"
              type="number"
              placeholder="$0.00"
              fullWidth
              name="newRate"
              value={newBaseAmount ? newBaseAmount : collaboratorContract.baseAmount}
              readOnly
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="effectiveDate"
                control={control}
                defaultValue={
                  Object.keys(props.formData).length
                    ? moment(props.formData.effectiveDate).format('YYYY-MM-DD')
                    : ''
                }
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de efectidad del ajuste"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      handleNEffectiveDate(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de efectidad del ajuste'}
                        placeholder="DD/MM/YYYY"
                        name="effectiveDate"
                        error={errors.effectiveDate && true}
                        helperText={
                          errors.effectiveDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('effectiveDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <ListItemIcon>
              <AddCircleOutlineIcon
                color="info"
                onClick={handleAddNumberRateIncrease}
                fontSize="small"
              />
              <Typography
                onClick={handleAddNumberRateIncrease}
                variant="h9"
                sx={{ color: 'info.main', fontSize: 'small' }}
              >
                Agregar incremento
              </Typography>
            </ListItemIcon>
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <CardMedia
            sx={{
              width: 150,
              height: 250,
              margin: 1
            }}
            image="prop-01.png"
          />
        </Grid>
      </Grid>
    </Grid>
  );
});

RateIncreaseStepSix.displayName = 'RateIncrease';
export default RateIncreaseStepSix;

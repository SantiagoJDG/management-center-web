import { useState, forwardRef, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, ListItemIcon, Divider, CardMedia } from '@mui/material';
import useEdit from 'hooks/useEdit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import 'moment/locale/es';

const RateIncreaseStepSix = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();
  const [rateIncrease, setRateIncrease] = useState({
    effectiveDateAdjustment: '',
    newRate: '',
    rateIncreasePercentages: [
      {
        rateIncreasePercentage: ''
      }
    ]
  });
  const [edit] = useEdit(`/api/collaborator/${props.newCollaboratorId}`, rateIncrease);
  const [numbeRateIncrease, setNumberRateIncrease] = useState([{ rateIncreasePercentage: '' }]);
  const secondTextFieldRef = useRef(null);

  const handleAddNumberRateIncrease = () => {
    setNumberRateIncrease([...numbeRateIncrease, { rateIncreasePercentage: '' }]);
  };

  const handleNumberRateChange = (event, index, key) => {
    const newNumbeRateIncrease = [...numbeRateIncrease];
    newNumbeRateIncrease[index][key] = event.target.value;

    setRateIncrease({
      ...rateIncrease,
      rateIncreasePercentages: newNumbeRateIncrease
    });
  };

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();
  const watchAllFields = watch();

  const [isMounted, setIsMounted] = useState(false);

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
    }
  };

  const validateForm = () => {
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const execution = await edit();
        afterExecution(execution);
      })();
    }
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
    const allFieldsCompleted = Object.values(watchAllFields).every((value) => value !== '');
    if (isDirty && allFieldsCompleted) {
      props.setFormCompleted(true);
    }
    ref.current = validateForm;
  }, [rateIncrease]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={4} p={2}>
          <Grid item>
            {numbeRateIncrease.map((Rate, index) => (
              <Grid item key={index}>
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
                  value={Rate.number}
                  {...register(`number-${index}`, {
                    required: true,
                    onChange: (event) => handleNumberRateChange(event, index, 'number')
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
            ))}
          </Grid>

          <Grid item>
            <CssTextField
              size="small"
              label="Nueva tarifa USD$"
              type="number"
              placeholder="$0.00"
              fullWidth
              name="newRate"
              {...register('newRate', {
                required: true,
                onChange: (event) => {
                  setRateIncrease({
                    ...rateIncrease,
                    newRate: event.target.value
                  });
                }
              })}
              error={errors.newRate}
              helperText={errors.newRate && 'Campo requerido'}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="effectiveDateAdjustment"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de efectidad del ajuste"
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de efectidad del ajuste'}
                        placeholder="DD/MM/YYYY"
                        name="effectiveDateAdjustment"
                        error={errors.effectiveDateAdjustment && true}
                        helperText={
                          errors.effectiveDateAdjustment && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('effectiveDateAdjustment', { required: true })}
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

import { useState, forwardRef, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, ListItemIcon, Divider, CardMedia } from '@mui/material';
import useEdit from 'hooks/useEdit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import 'moment/locale/es';

const RateIncreaseStepSix = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();
  const [rateIncrease, setRateIncrease] = useState({
    admissionDate: '',
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

  const handleNumbeRateChange = (event, index, key) => {
    const newnumbeRateIncrease = [...numbeRateIncrease];
    newnumbeRateIncrease[index][key] = event.target.value;

    if (key === 'areaCode') {
      const input = event.target.value;
      const expectedLength = 3;

      if (input.length === expectedLength) {
        secondTextFieldRef.current.focus();
      }
    }
    setRateIncrease({
      ...rateIncrease,
      rateIncreasePercentages: newnumbeRateIncrease
    });
  };

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors }
  } = useForm();

  const afterExecution = (execution) => {
    if (execution.status !== 200 || execution.data === 'SequelizeUniqueConstraintError') {
      handleNewMessage({
        text: 'Por favor revisar los campos que deben ser unicos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
        severity: 'success'
      });
      props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    ref.current = validateForm;
  }, [rateIncrease]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={5} p={2}>
          <Grid item>
            {numbeRateIncrease.map((Rate, index) => (
              <Grid item key={index}>
                <CssTextField
                  required
                  sx={{ width: '75%' }}
                  id={`number-${index}`}
                  name={`number-${index}`}
                  label="Porcentaje de incremento de tarifa"
                  placeholder="%"
                  type="number"
                  size="small"
                  fullWidth
                  variant="outlined"
                  inputRef={secondTextFieldRef}
                  value={Rate.number}
                  {...register(`number-${index}`, {
                    required: true,
                    onChange: (event) => handleNumbeRateChange(event, index, 'number')
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
                <Grid sx={{ pl: 2, pt: 2 }}></Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item>
            <CssTextField
              sx={{ width: '75%' }}
              size="small"
              label="Nueva tarifa USD$"
              type="number"
              placeholder="$0000.00"
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
                name="admissionDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de efectidad del ajuste"
                    maxDate={moment().format()}
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
                        name="admissionDate"
                        error={errors.admissionDate && true}
                        helperText={
                          errors.admissionDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('admissionDate', { required: true })}
                      />
                    )}
                  />
                )}
              />
              <Grid sx={{ pl: 2, pt: 1 }}>
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
            </LocalizationProvider>
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

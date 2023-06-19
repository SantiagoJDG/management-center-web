import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CardMedia, Divider, Grid, ListItemIcon, Typography } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useEdit from 'hooks/useEdit';
import useMessage from 'hooks/useMessage';
import 'moment/locale/es';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CssTextField } from '../../../styles/formButton';
import { getDataInformation } from '../../../utils/dataUtils';

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

  const [create] = useEdit(
    `/api/collaborator/${props.newCollaboratorId}/contract/fare_increase`,
    rateIncrease
  );

  const [numbeRateIncrease, setNumberRateIncrease] = useState([{ rateIncreasePercentage: '' }]);
  const [newBaseAmount, setNewBaseAmount] = useState();
  const [collaboratorContract, setCollaboratorContract] = useState();

  const secondTextFieldRef = useRef(null);

  const handleAddNumberRateIncrease = () => {
    setNumberRateIncrease([...numbeRateIncrease, { rateIncreasePercentage: '' }]);
  };

  const handleNumberRateChange = (event) => {
    const percentageValue = (collaboratorContract.baseAmount * parseInt(event.target.value)) / 100;
    const newBaseAmount = collaboratorContract.baseAmount + percentageValue;

    setNewBaseAmount(newBaseAmount);
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

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      getCollaboratorContract();
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
                    onBlur: (event) => handleNumberRateChange(event, index, 'number')
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
              value={newBaseAmount}
              readOnly
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

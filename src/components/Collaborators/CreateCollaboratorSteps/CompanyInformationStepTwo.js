import { useState, forwardRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, Divider, CardMedia } from '@mui/material';
import useEdit from 'hooks/useEdit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CssTextField } from '../../../styles/formButton';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';

const CompanyInformationStepTwo = forwardRef((props, ref) => {
  const { handleNewMessage } = useMessage();
  const [age, setAge] = useState(0);
  const [errorEmailMessage, setEmailErrorMessage] = useState('');
  const [companyInformation, setCompanyInformation] = useState({
    businessCode: '',
    admissionDate: '',
    businessEmail: ''
  });
  const [edit] = useEdit(`/api/collaborator/${props.newCollaboratorId}`, companyInformation);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isDirty }
  } = useForm();

  const [isMounted, setIsMounted] = useState(false);
  const watchAllFields = watch();

  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setCompanyInformation({
      ...companyInformation,
      admissionDate: date
    });
    setAge(age);
  };

  const handleOnChangeEmail = (event) => {
    const inputValue = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputValue)) {
      setEmailErrorMessage('');
      setCompanyInformation({ ...companyInformation, businessEmail: inputValue });
    } else {
      setEmailErrorMessage('El valor ingresado no es un correo electrónico válido.');
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
        text: 'Excelente! La Informacion personal del colaborador fue creada exitosamente',
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
  }, [companyInformation]);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={5} p={2}>
          <Grid item>
            <CssTextField
              size="small"
              label="Codigo de empleado"
              fullWidth
              name="businessCode"
              {...register('businessCode', {
                required: true,
                onChange: (event) => {
                  setCompanyInformation({
                    ...companyInformation,
                    businessCode: event.target.value
                  });
                }
              })}
              error={errors.businessCode}
              helperText={errors.businessCode && 'Campo requerido'}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="admissionDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de ingreso"
                    maxDate={moment().format()}
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      calculateAge(newValue);
                    }}
                    renderInput={(params) => (
                      <CssTextField
                        {...params}
                        sx={{ width: '100%' }}
                        required
                        size="small"
                        label={'Fecha de ingreso'}
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
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <CssTextField
              label="Antiguedad"
              value={age ? age + ' años corporativos' : 0}
              size={'small'}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <CssTextField
              required
              sx={{ width: '100%' }}
              label="Email"
              variant="outlined"
              size="small"
              fullWidth
              name="businessEmail"
              {...register('businessEmail', {
                required: true,
                onChange: (event) => handleOnChangeEmail(event)
              })}
              error={errors.businessEmail || !!errorEmailMessage}
              helperText={
                errorEmailMessage ||
                (errors.businessEmail && (
                  <Typography variant="caption" color="error">
                    Campo requerido
                  </Typography>
                ))
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem></Divider>
      <Grid item xs={5}>
        <Grid container spacing={3} p={2} direction={'column'}>
          <CardMedia
            sx={{
              width: 300,
              height: 300,
              margin: 1
            }}
            image="prop-0.png"
          />
        </Grid>
      </Grid>
    </Grid>
  );
});

CompanyInformationStepTwo.displayName = 'CompanyInformationStepTwo';
export default CompanyInformationStepTwo;

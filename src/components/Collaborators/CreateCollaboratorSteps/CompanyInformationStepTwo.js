import { useState, forwardRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Typography, Divider, CardMedia } from '@mui/material';
import useEdit from 'hooks/useEdit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CssTextField } from '../../../styles/formButton';
import moment from 'moment';
import 'moment/locale/es';

const CompanyInformationStepTwo = forwardRef((props, ref) => {
  const [age, setAge] = useState(0);
  const [errorEmailMessage, setEmailErrorMessage] = useState('');
  const [companyInformation, setCompanyInformation] = useState({
    codeEmployee: '',
    onBoardingDate: '',
    corporateEmail: ''
  });
  const [edit] = useEdit('/api/collaborator', companyInformation);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors }
  } = useForm();

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
      onBoardingDate: date
    });
    setAge(age);
  };

  const handleOnChangeEmail = (event) => {
    const inputValue = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputValue)) {
      setEmailErrorMessage('');
      setCompanyInformation({ ...companyInformation, corporateEmail: inputValue });
    } else {
      setEmailErrorMessage('El valor ingresado no es un correo electrónico válido.');
    }
  };

  const validateForm = () => {
    const isValid = trigger();
    if (isValid) {
      handleSubmit(async () => {
        const error = await edit();
        if (error) return;
        props.setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })();
    }
  };

  useEffect(() => {
    ref.current = validateForm;
  }, []);

  return (
    <Grid container direction={'row'} xs={11} justifyContent={'space-between'} p={2}>
      <Grid item xs={5}>
        <Grid container direction={'column'} spacing={5} p={2}>
          <Grid item>
            <CssTextField
              size="small"
              label="Codigo de empleado"
              fullWidth
              name="employeeCode"
              {...register('employeeCode', {
                required: true,
                onChange: (event) => {
                  setCompanyInformation({
                    ...companyInformation,
                    codeEmployee: event.target.value
                  });
                }
              })}
              error={errors.employeeCode}
              helperText={errors.employeeCode && 'Campo requerido'}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="onBoardingDate"
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
                        name="onBoardingDate"
                        error={errors.onBoardingDate && true}
                        helperText={
                          errors.onBoardingDate && (
                            <Typography variant="caption" color="error">
                              Campo requerido
                            </Typography>
                          )
                        }
                        {...register('onBoardingDate', { required: true })}
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
              value={age}
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
              name="personalEmail"
              {...register('personalEmail', {
                required: true,
                onChange: (event) => handleOnChangeEmail(event)
              })}
              error={errors.personalEmail || !!errorEmailMessage}
              helperText={
                errorEmailMessage ||
                (errors.personalEmail && (
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

CompanyInformationStepTwo.displayName = 'CompanyInformation';
export default CompanyInformationStepTwo;

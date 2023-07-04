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

  const [errorEmailMessage, setEmailErrorMessage] = useState('');
  const [companyInformation, setCompanyInformation] = useState({
    businessCode: '',
    admissionDate: '',
    businessEmail: ''
  });
  const [corporativeYears, setCorporativeYears] = useState(
    Object.keys(props.formData).length
      ? moment(moment().format()).diff(moment(props.formData.admissionDate).format(), 'year') +
          ' años corporativos y ' +
          moment().month(moment(props.formData.admissionDate).month()).fromNow(true)
      : 0
  );

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

  const calculateCoporativeYears = (date) => {
    const monthOfRelativeDate = moment().month(moment(date).month()).fromNow(true);
    const yearOfRelativeDate = moment().from(date);
    setCorporativeYears(`${yearOfRelativeDate} corporativos y ${monthOfRelativeDate}`);
    setCompanyInformation({
      ...companyInformation,
      admissionDate: date
    });
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
      props.rememberStepFormInformation(props.stepName, companyInformation);
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
      if (Object.keys(props.formData).length) {
        const { formData } = props;
        setCompanyInformation(formData);
      }
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
              defaultValue={
                props.formData ? props.formData.businessCode : props.formData.businessCode
              }
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
                defaultValue={
                  Object.keys(props.formData).length
                    ? moment(props.formData.admissionDate).format('YYYY-MM-DD')
                    : ''
                }
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Fecha de ingreso"
                    maxDate={moment().format()}
                    value={value || null}
                    onChange={(newValue) => {
                      onChange(newValue);
                      calculateCoporativeYears(newValue);
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
              value={corporativeYears ? corporativeYears : 0}
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
              defaultValue={props.formData ? props.formData.businessEmail : ''}
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

import { useEffect, useState, forwardRef, useRef } from 'react';
import { Grid } from '@mui/material';
import { CssTextFieldStandard } from '../../../styles/formButton';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CompanyInformationStepTwo from '../CreateCollaboratorSteps/CompanyInformationStepTwo';
import useMessage from 'hooks/useMessage';
import moment from 'moment';
import 'moment/locale/es';

const CompanyInformation = forwardRef((props, ref) => {
  const [companyInformation, setCompanyInformation] = useState({
    businessCode: '',
    admissionDate: '',
    businessEmail: ''
  });
  const validationRef = useRef(null);
  const { handleNewMessage } = useMessage();

  const editForm = async () => {
    var execution = undefined;
    handleExecution(execution);
    return;
  };

  const handleExecution = (execution) => {
    if (execution.status !== 200) {
      handleNewMessage({
        text: 'Por favor revisar los campos',
        severity: 'error'
      });
    } else {
      handleNewMessage({
        text: 'Excelente! La Informacion personal del colaborador fue editada exitosamente',
        severity: 'success'
      });
    }
  };

  const displayBusinessCode = () => {
    return (
      <CssTextFieldStandard
        size="small"
        label="Codigo de empleado"
        variant="standard"
        fullWidth
        defaultValue={companyInformation.businessCode}
        focused
        aria-readonly={props.editable}
      />
    );
  };

  const displayDatePicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label="Fecha de nacimiento"
          maxDate={moment().format()}
          value={moment(companyInformation.admissionDate).format('YYYY-MM-DD') || null}
          renderInput={(params) => (
            <CssTextFieldStandard
              focused
              {...params}
              sx={{ width: '100%' }}
              variant="standard"
              label={'Fecha de nacimiento'}
              placeholder="DD/MM/YYYY"
              name="birthdate"
            />
          )}
        />
      </LocalizationProvider>
    );
  };

  const antiquityCalculation = () => {
    return (
      moment(moment().format()).diff(moment(companyInformation.admissionDate).format(), 'year') +
      ' años corporativos y ' +
      moment().month(moment(companyInformation.admissionDate).month()).fromNow(true)
    );
  };

  const displayCorporativeYears = () => {
    return (
      <CssTextFieldStandard
        label="Antiguedad"
        value={antiquityCalculation()}
        size={'small'}
        variant="standard"
        InputProps={{ readOnly: true }}
        fullWidth
        focused
      />
    );
  };

  const displayEmail = () => {
    return (
      <CssTextFieldStandard
        sx={{ width: '100%' }}
        label="Email Personal"
        variant="standard"
        focused
        value={companyInformation.businessEmail}
        aria-readonly={props.editable}
      />
    );
  };

  const companyVisualInfo = () => {
    return (
      <Grid container direction={'column'} xs={4} spacing={5} p={2}>
        <Grid item>{displayBusinessCode()}</Grid>
        <Grid item>{displayDatePicker()}</Grid>
        <Grid item>{displayCorporativeYears()}</Grid>
        <Grid item>{displayEmail()}</Grid>
      </Grid>
    );
  };

  const editCompanyInformation = () => {
    return (
      <Grid pt={10}>
        <CompanyInformationStepTwo formData={companyInformation} ref={validationRef} />
      </Grid>
    );
  };

  useEffect(() => {
    const storedInfo = JSON.parse(sessionStorage.getItem('personal'));
    if (storedInfo) setCompanyInformation(storedInfo);
    ref.current = editForm;
  }, [companyInformation]);

  return props.editable ? companyVisualInfo() : editCompanyInformation();
});
CompanyInformation.displayName = 'PersonalInformation';

export default CompanyInformation;

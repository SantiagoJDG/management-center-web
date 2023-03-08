import { Grid, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/es';
import { useState } from 'react';

export const DateBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  const [initialDate, setInitialDate] = useState(moment().format());
  const [endDate, setEndDate] = useState(moment().format());
  const [error, setError] = useState(null);

  const onChangeInitialDate = (newValue) => {
    if (newValue.isValid()) {
      setInitialDate(newValue.format());
      setCollaborators(filterByAdmissionDate(newValue.format(), endDate));
    }
  };

  const onChangeEndDate = (newValue) => {
    if (newValue.isValid()) {
      setEndDate(newValue.format());
      setCollaborators(filterByAdmissionDate(initialDate, newValue.format()));
    }
  };

  const filterByAdmissionDate = (initialDate, endDate) => {
    const arrayToFiter = collaborators.length < 1 ? allCollaborators : collaborators;
    return arrayToFiter.filter((collaborator) => {
      return moment(collaborator.admissionDate).isBetween(initialDate, endDate);
    });
  };

  function setDateError(error) {
    let newError = { error: true, message: '' };

    switch (error) {
      case 'maxDate': {
        newError.message = 'Fecha maxima no valida';
        break;
      }

      case 'minDate': {
        newError.message = 'Fecha minima no valida';
        break;
      }

      case 'invalidDate': {
        newError.message = 'Fecha no valida';
        break;
      }

      default: {
        newError.message = '';
      }
    }
    setError(newError);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            onError={setDateError}
            slotProps={{
              textField: {
                helperText: error && error.message
              }
            }}
            fullWidth
            maxDate={endDate}
            label="Fecha de Inicio"
            inputFormat="MM/DD/YYYY"
            value={initialDate}
            onChange={onChangeInitialDate}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            fullWidth
            onError={setDateError}
            slotProps={{
              textField: {
                helperText: error && error.message
              }
            }}
            minDate={initialDate}
            label="Fecha de Cierre"
            inputFormat="MM/DD/YYYY"
            value={endDate}
            onChange={onChangeEndDate}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default DateBarFilter;

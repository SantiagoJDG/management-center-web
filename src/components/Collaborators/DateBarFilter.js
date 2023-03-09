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
  const [initialDateError, setInitialDateError] = useState(null);
  const [endDateError, setEndDateError] = useState(null);

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

  function handleInitialDateError(reason) {
    setInitialDateError(getErrorData(reason));
  }

  function handleEndDateError(reason) {
    setEndDateError(getErrorData(reason));
  }

  function getErrorData(reason) {
    console.log(reason);
    let newError = { error: true, message: '' };

    switch (reason) {
      case 'maxDate': {
        newError.message = 'No puede ser mayor a Fecha de cierre';
        break;
      }

      case 'minDate': {
        newError.message = 'No puede ser menor a Fecha de inicio';
        break;
      }

      case 'invalidDate': {
        newError.message = 'Fecha no válida';
        break;
      }

      default: {
        newError.message = '';
      }
    }
    return newError;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            fullWidth
            maxDate={endDate}
            label="Fecha de inicio"
            inputFormat="MM/DD/YYYY"
            value={initialDate}
            onChange={onChangeInitialDate}
            onError={handleInitialDateError}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                helperText={initialDateError && initialDateError.message}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DesktopDatePicker
            fullWidth
            minDate={initialDate}
            label="Fecha de cierre"
            inputFormat="MM/DD/YYYY"
            value={endDate}
            onChange={onChangeEndDate}
            onError={handleEndDateError}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                helperText={endDateError && endDateError.message}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default DateBarFilter;

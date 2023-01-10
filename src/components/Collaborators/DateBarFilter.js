import { Grid, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'moment/locale/es';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export const DateBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  const { userToken, waitingUser } = useAuth();
  const [initialDate, setInitialDate] = useState();
  const [endDate, setEndDate] = useState();
  const [admissionDate, setAdmissionDate] = useState([]);

  useEffect(() => {
    if (!userToken) return;
  }, [userToken, waitingUser]);

  const setCollaboratorAdmissionDate = async () => {
    return new Promise((res) => {
      const admissionDateRaw = [];
      for (let index = 0; index < allCollaborators.length; index++) {
        admissionDateRaw.push(allCollaborators[index].admission_date);
      }
      if (admissionDateRaw.length === allCollaborators.length) {
        setAdmissionDate(admissionDateRaw);
        return res(true);
      }
    });
  };

  const onChangeInitialDate = (newValue) => {
    setCollaboratorAdmissionDate();
    const startFilter = new Date(newValue);
    setInitialDate(startFilter);
    if (!initialDate) return;
    executeFilter();
  };

  const onChangeEndDate = (newValue) => {
    setCollaboratorAdmissionDate();
    const endFilter = new Date(newValue);
    setEndDate(endFilter);
    if (!endDate) return;
    executeFilter();
  };

  const executeFilter = () => {
    const betweenDates = isBetweenDates(initialDate, endDate, admissionDate);
    setCollaborators(filteredCollaborator(allCollaborators, betweenDates, 'admission_date'));
  };

  const filteredCollaborator = (collaborators, betweenDates, collaboratorKey) => {
    if (!betweenDates.length) return [];
    return allCollaborators.filter((filteredCollaborator) => {
      return betweenDates.includes(filteredCollaborator[collaboratorKey]);
    });
  };

  const isBetweenDates = (startFilterDate, endFilterDate, admission) => {
    return admission.filter((date) => {
      const collaboratorAdmissionDate = new Date(date);
      if (
        collaboratorAdmissionDate > startFilterDate &&
        collaboratorAdmissionDate < endFilterDate
      ) {
        return date;
      } else {
        return;
      }
    });
  };

  return (
    !!collaborators && (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
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
    )
  );
};

export default DateBarFilter;

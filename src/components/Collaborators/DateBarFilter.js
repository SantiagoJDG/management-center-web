import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/';
// import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Grid, TextField } from '@mui/material';
import 'moment/locale/es';

export const DateBarFilter = ({ collaborators, setCollaborators, allCollaborators }) => {
  const { userToken, waitingUser } = useAuth();
  const [initialDate, setInitialDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [admissionDate, setAdmissionDate] = useState([]);

  useEffect(() => {
    if (!userToken) return;

    setCollaboratorAdmissionDate(collaborators);
  }, [userToken, waitingUser]);

  const setCollaboratorAdmissionDate = async (collaborators) => {
    return new Promise((res, rej) => {
      const admissionDateRaw = [];
      for (let index = 0; index < collaborators.length; index++) {
        admissionDateRaw.push(collaborators[index].admission_date);
      }
      if (admissionDateRaw.length === collaborators.length) {
        setAdmissionDate(admissionDateRaw);
        return res(true);
      }
    });
  };

  const onChangeInitialDate = (newValue) => {
    console.log(admissionDate);
    const startFilter = new Date(newValue);
    setInitialDate(startFilter);
    const betweenDates = isBetweenDates(initialDate, endDate, admissionDate);
    setCollaborators(filteredCollaborator(allCollaborators, betweenDates, 'admission_date'));
  };

  const onChangeEndDate = (newValue) => {
    console.log(admissionDate);
    const endFilter = new Date(newValue);
    setEndDate(endFilter);
    const betweenDates = isBetweenDates(initialDate, endDate, admissionDate);
    console.log('dates matched');
    console.log(betweenDates);
    setCollaborators(filteredCollaborator(allCollaborators, betweenDates, 'admission_date'));
  };

  const filteredCollaborator = (collaborators, betweenDates, collaboratorKey) => {
    if (!betweenDates.length) return collaborators;
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
        console.log('out');
      }
    });
  };

  return (
    <>
      <Grid container sx={{ flexWrap: 'wrap', padding: 2 }}>
        <Grid item xs={12} lg={4}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              fullWidth
              maxDate={endDate}
              label="Fecha de Inicio"
              inputFormat="MM/DD/YYYY"
              value={initialDate}
              onChange={(newValue) => {
                onChangeInitialDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} lg={4}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              fullWidth
              minDate={initialDate}
              label="Fecha de Cierre"
              inputFormat="MM/DD/YYYY"
              value={endDate}
              onChange={(newValue) => {
                onChangeEndDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </>
  );
};

export default DateBarFilter;

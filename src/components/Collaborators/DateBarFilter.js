import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Grid, TextField, Box } from '@mui/material';
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
    return new Promise((res) => {
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
    const startFilter = new Date(newValue);
    setInitialDate(startFilter);
    const betweenDates = isBetweenDates(initialDate, endDate, admissionDate);
    setCollaborators(filteredCollaborator(allCollaborators, betweenDates, 'admission_date'));
  };

  const onChangeEndDate = (newValue) => {
    const endFilter = new Date(newValue);
    setEndDate(endFilter);
    const betweenDates = isBetweenDates(initialDate, endDate, admissionDate);
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
      <Grid container sx={{ flexWrap: 'wrap', display: 'flex', gap: 1 }}>
        <Grid item>
          <Box xs={1} sm={1} md={1} lg={2}>
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
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid item>
          <Box xs={1} sm={1} md={1}>
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
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default DateBarFilter;

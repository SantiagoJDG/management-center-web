import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Divider,
  Grid,
  List,
  ListItem,
  TextField
} from '@mui/material';
import { Box } from '@mui/system';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from 'moment';
import { useState } from 'react';

const EditableCollaborator = () => {
  const [value, setValue] = useState(moment().format());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const country = [{ label: 'Panamá' }, { label: 'Venezuela' }];
  const city = [{ label: 'Panamá' }, { label: 'Caracas' }];

  const showInformation = () => {
    return (
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="personal-information-content"
            id="personal-information-header"
          >
            <h2>Información de identidad personal</h2>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      required
                      id="outlined-required"
                      label="Código consultor"
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Nombres y Apellidos"
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Email corporativo"
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <MobileDatePicker
                        fullWidth
                        label="Fecha de ingreso"
                        inputFormat="DD/MM/YYYY"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-required"
                      label="Antigüedad"
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={country}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="País de residencia" />}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={city}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Ciudad de residencia" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="contract-information-content"
            id="contract-information-header"
          >
            <h2>Información de contrato</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Consultec-TI']}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Empresa contratante" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Panamá']}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Oficina de contrato" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Activo', 'Inactivo']}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Oficina de contrato" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Honorarios profesionales']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Tipo de contrato" />}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Tarifa mensual bruta"
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="operations-information-content"
            id="operations-information-header"
          >
            <h2>Información de operaciones</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Operaciones']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Dirección" />}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Fernando Diaz']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Supervidor" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Desarrollador']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Perfil" />}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Banco General Panamá']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Cliente" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={[
                        'Backend',
                        'Base de datos',
                        ' APIs',
                        ' Frontend Web',
                        'Full Stack',
                        'Liferay'
                      ]}
                      getOptionLabel={(option) => option}
                      defaultValue={['Backend']}
                      filterSelectedOptions
                      renderInput={(params) => <TextField {...params} label="Perfil" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={['Java', 'NodeJs', 'Phyton', 'SQL', 'React', 'JavaScript']}
                      getOptionLabel={(option) => option}
                      defaultValue={['Java']}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} label="Tecnologías predominantes" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="consultec-identity-content"
            id="consultec-identity-header"
          >
            <h2>Información de identidad consultec</h2>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Lider técnico']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Rol" />}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Lider']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Seniority" />}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['1', '2']}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Readiness" />}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />

              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="outlined-required"
                      label="Firma de correo"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      size="small"
                      options={['Lider']}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Rol dentro del sistema" />
                      )}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return showInformation();
};

export default EditableCollaborator;

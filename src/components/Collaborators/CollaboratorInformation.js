import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import 'moment/locale/es';
import { useState, useEffect } from 'react';

const CollaboratorInformation = ({ collaboratorData }) => {
  const [collaborator, setCollaborator] = useState();

  const showInformation = () => {
    if (collaborator) {
      const {
        admissionDate,
        internalCode,
        name,
        emailSignature,
        email,
        country,
        supervisor,
        state,
        company,
        office,
        status,
        contractType,
        salaryAmount,
        management,
        client,
        profiles,
        knowledges,
        technologies,
        role,
        seniority,
        readiness,
        internalRole
      } = collaborator;

      const admissionDateFormated = moment(admissionDate).format('LL');
      const relativeDateFromAdmission = moment(admissionDate).fromNow();

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
                  <ListItemText primary="Código consultor" secondary={internalCode} />
                  <ListItemText primary="Nombres y Apellidos" secondary={name} />
                  <ListItemText primary="Email corporativo" secondary={email} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Fecha de ingreso" secondary={admissionDateFormated} />
                  <ListItemText primary="Antigüedad" secondary={relativeDateFromAdmission} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="País de residencia" secondary={country.name} />
                  <ListItemText primary="Ciudad de residencia" secondary={state.name} />
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
                  <ListItemText primary="Empresa contratante" secondary={company.name} />
                  <ListItemText primary="Oficina de contrato" secondary={office.name} />
                  <ListItemText
                    primary="Estado"
                    secondary={
                      <Chip
                        label={status.name}
                        color={status.name == 'ACTIVO' ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Tipo de contrato" secondary={contractType.name} />
                  <ListItemText
                    primary="Tarifa mensual bruta"
                    secondary={new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(salaryAmount ? salaryAmount : 0)}
                  />
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
                  <ListItemText primary="Dirección" secondary={management.name} />
                  <ListItemText primary="Supervidor" secondary={supervisor.name} />
                  <ListItemText primary="Cliente" secondary={client.name} />
                </ListItem>

                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item sm={12}>
                      <ListItemText primary="N1-Perfil" />
                    </Grid>
                    <Grid item sm={12}>
                      {profiles.map((profile) => {
                        return (
                          <Chip
                            key={profile.id}
                            label={profile.name}
                            color="info"
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </ListItem>

                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item sm={12}>
                      <ListItemText primary="N2-Especialidad" />
                    </Grid>
                    <Grid item sm={12}>
                      {knowledges.map((knowledge) => {
                        return (
                          <Chip
                            key={knowledge.id}
                            label={knowledge.name}
                            color="info"
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </ListItem>

                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item sm={12}>
                      <ListItemText primary="N3-tecnologías predominantes" />
                    </Grid>
                    <Grid item sm={12}>
                      {technologies.map((technology) => {
                        return (
                          <Chip
                            key={technology.id}
                            label={technology.name}
                            variant="outlined"
                            size="small"
                          />
                        );
                      })}
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
                  <ListItemText primary="Rol" secondary={role.name} />
                  <ListItemText primary="Seniority" secondary={seniority.name} />
                  <ListItemText
                    primary="Readiness"
                    secondary={
                      <Chip
                        label={readiness.name}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText
                    primary="Firma de correo"
                    secondary={emailSignature}
                  />
                  <ListItemText
                    primary="Rol dentro del sistema"
                    secondary={internalRole.name}
                  />
                </ListItem>
                <Divider />
              </List>
            </AccordionDetails>
          </Accordion>{' '}
        </Box>
      );
    } else {
      return 'There is not collaborator';
    }
  };

  useEffect(() => {
    setCollaborator(collaboratorData);
  }, [collaboratorData]);

  return showInformation();
};

export default CollaboratorInformation;

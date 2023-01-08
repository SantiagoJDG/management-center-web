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
      const admissionDateFormated = moment(collaborator.admission_date).format('LL');
      const relativeDateFromAdmission = moment(collaborator.admission_date).fromNow();
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
                  <ListItemText primary="Código consultor" secondary={collaborator.internal_code} />
                  <ListItemText primary="Nombres y Apellidos" secondary={collaborator.name} />
                  <ListItemText primary="Email corporativo" secondary={collaborator.email} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Fecha de ingreso" secondary={admissionDateFormated} />
                  <ListItemText primary="Antigüedad" secondary={relativeDateFromAdmission} />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="País de residencia" secondary={collaborator.country} />
                  <ListItemText primary="Ciudad de residencia" secondary={collaborator.state} />
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
                  <ListItemText primary="Empresa contratante" secondary={collaborator.company} />
                  <ListItemText primary="Oficina de contrato" secondary={collaborator.office} />
                  <ListItemText
                    primary="Estado"
                    secondary={
                      <Chip
                        label={collaborator.status}
                        color={collaborator.status == 'ACTIVO' ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Tipo de contrato" secondary={collaborator.contract_type} />
                  <ListItemText
                    primary="Tarifa mensual bruta (AUN NO)"
                    secondary={new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(10000)}
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
                  <ListItemText primary="Dirección" secondary={collaborator.management} />
                  <ListItemText primary="Supervidor" secondary={collaborator.supervisor} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Perfil" secondary={collaborator.profile} />
                  <ListItemText primary="Cliente" secondary={collaborator.client} />
                </ListItem>
                <Divider />

                <ListItem>
                  <Grid container>
                    <Grid sm={12}>
                      <ListItemText primary="Especialidad" />
                    </Grid>
                    <Grid sm={12}>
                      {collaborator.knowledges.map((knowledge) => {
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
                    <Grid sm={12}>
                      <ListItemText primary="Tecnologías predominantes" />
                    </Grid>
                    <Grid sm={12}>
                      {collaborator.technologies.map((technology) => {
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
                  <ListItemText primary="Rol" secondary={collaborator.role} />
                  <ListItemText primary="Seniority" secondary={collaborator.seniority} />
                  <ListItemText
                    primary="Readiness"
                    secondary={
                      <Chip
                        label={collaborator.readiness}
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
                    secondary={collaborator.email_signature}
                  />
                  <ListItemText
                    primary="Rol dentro del sistema"
                    secondary={collaborator.identity_role}
                  />
                </ListItem>
                <Divider />
              </List>
            </AccordionDetails>
          </Accordion>
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

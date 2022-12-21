import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { Box } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CollaboratorInformation = ({ collaboratorData }) => {
  const [collaborator, setCollaborator] = useState(collaboratorData);

  const showInformation = () => {
    if (collaborator) {
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
                  <ListItemText primary="Código consultor" secondary="CT-001" />
                  <ListItemText
                    primary="Nombres y Apellidos"
                    secondary="Edgar Alexandeer Guevara Naranjo"
                  />
                  <ListItemText primary="Email corporativo" secondary="eguevara@consultec-ti.com" />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Fecha de ingreso" secondary="15 de Julio 2015" />
                  <ListItemText primary="Antigüedad" secondary="7.8" />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="País de residencia" secondary="Panamá" />
                  <ListItemText primary="Ciudad de residencia" secondary="Panamá" />
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
                  <ListItemText primary="Empresa contratante" secondary="Consultec-TI" />
                  <ListItemText primary="Oficina de contrato" secondary="Panamá" />
                  <ListItemText
                    primary="Estado"
                    secondary={
                      <Chip label={'Activo'} color="success" variant="outlined" size="small" />
                    }
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Tipo de contrato" secondary="Honorarios profesionales" />
                  <ListItemText
                    primary="Tarifa mensual bruta"
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
                  <ListItemText primary="Dirección" secondary="Operaciones" />
                  <ListItemText primary="Supervidor" secondary="Fernando Diaz" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Perfil" secondary="Desarrollador" />
                  <ListItemText primary="Cliente" secondary="Banco General Panamá" />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText
                    primary="Especialidad"
                    secondary={
                      <>
                        <Chip label={'Backend'} color="info" variant="outlined" size="small" />
                        <Chip
                          label={'Base de datos'}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                        <Chip label={' APIs'} color="info" variant="outlined" size="small" />
                        <Chip
                          label={' Frontend Web'}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                        <Chip label={'Full Stack'} color="info" variant="outlined" size="small" />
                        <Chip label={'Liferay'} color="info" variant="outlined" size="small" />
                      </>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tecnologías predominantes"
                    secondary={
                      <>
                        <Chip label={'Java'} variant="outlined" size="small" />
                        <Chip label={'NodeJs'} variant="outlined" size="small" />
                        <Chip label={'Phyton'} variant="outlined" size="small" />
                        <Chip label={'SQL'} variant="outlined" size="small" />
                        <Chip label={'React'} variant="outlined" size="small" />
                        <Chip label={'JavaScript'} variant="outlined" size="small" />
                      </>
                    }
                  />
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
                  <ListItemText primary="Rol" secondary="Lider técnico" />
                  <ListItemText primary="Seniority" secondary="Lider" />
                  <ListItemText
                    primary="Readiness"
                    secondary={<Chip label={'1'} color="primary" variant="outlined" size="small" />}
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText primary="Firma de correo" secondary="Project & Technical Leader" />
                  <ListItemText primary="Rol dentro del sistema" secondary="Lider" />
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

  return showInformation();
};

export default CollaboratorInformation;

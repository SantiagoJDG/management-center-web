import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fab,
  IconButton,
  InputBase,
  Typography
} from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import useMessage from 'hooks/useMessage';
import useAuth from '../../hooks/useAuth';

import Objective from 'components/PlannerDashboard/Objective';

const Dashboard = () => {
  const [businessPlan, setBusinessPlan] = useState();
  const [newObjective, setNewObjective] = useState(false);
  const [newObjectiveDescription, setNewObjectiveDescription] = useState('');
  const { userToken, waitingUser, userData } = useAuth();

  const { handleNewMessage } = useMessage();

  const router = useRouter();

  const getBusinessPlan = async () => {
    try {
      let response = await getAxiosInstance().get('/api/business-plan/1');
      console.log(response.data);
      setBusinessPlan(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  const handleNewObjectiveDescription = (event) => {
    setNewObjectiveDescription(event.target.value);
  };

  const saveNewObjective = async () => {
    if (!newObjectiveDescription || newObjectiveDescription == '') {
      handleNewMessage({
        text: 'Por favor ingrese un objetivo valido antes de continuar.',
        severity: 'error'
      });
      return;
    }
    try {
      const objetiveObject = {
        description: newObjectiveDescription,
        author: userData.id,
        businessPlan: businessPlan.id
      };

      await getAxiosInstance()
        .post('api/business-plan/objective', objetiveObject)
        .then(() => {
          handleNewMessage({
            text: 'Nuevo objetivo guardado con exito.',
            severity: 'success'
          });
          getBusinessPlan();
          setNewObjectiveDescription('');
          setNewObjective(false);
        });
    } catch (error) {
      handleNewMessage({
        text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
        severity: 'error'
      });
    }
  };

  function handleCreateNewObjective() {
    setNewObjective(!newObjective);
  }

  const displayObjectives = () => {
    if (businessPlan) {
      return (
        <Box>
          {businessPlan.objectivesData.map((objective, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'info.contrastText' }} />}
                  aria-controls={`businessObjective-${index}${objective.id}-content`}
                  id={`businessObjective-${index}${objective.id}-header`}
                  sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
                >
                  <Typography variant="h6">{objective.description} </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Objective
                    key={objective.id}
                    objective={objective}
                    getBusinessObjective={getBusinessPlan}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
          <Fab
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'info.main',
              color: 'info.contrastText'
            }}
            aria-label={'Add'}
            color={'primary'}
            onClick={handleCreateNewObjective}
          >
            {<AddIcon />}
          </Fab>
        </Box>
      );
    }
  };

  function displayCreateNewObjective() {
    if (newObjective) {
      return (
        <Accordion expanded={false}>
          <AccordionSummary
            id={'NewObjectiveAccordion'}
            sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Escriba su nuevo objetivo"
              inputProps={{ 'aria-label': 'create new objective' }}
              onChange={handleNewObjectiveDescription}
            />
            <IconButton
              type="button"
              sx={{ color: 'info.contrastText' }}
              aria-label="save new objective"
              onClick={saveNewObjective}
            >
              <SaveIcon />
            </IconButton>
          </AccordionSummary>
        </Accordion>
      );
    }
  }

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }

    getBusinessPlan();
  }, [userToken, waitingUser]);

  return (
    <>
      {displayCreateNewObjective()}
      {displayObjectives()}
    </>
  );
};

export default Dashboard;

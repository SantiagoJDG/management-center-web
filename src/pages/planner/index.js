import { useState, useEffect } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardHeader,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useAuth from '../../hooks/useAuth';
import Objective from 'components/PlannerDashboard/Objective';

const Dashboard = () => {
  const [businessPlan, setBusinessPlan] = useState();
  const [newObjective, setNewObjective] = useState(false);
  const { userToken, waitingUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }

    getBusinessPlan();
  }, [userToken, waitingUser]);

  const getBusinessPlan = async () => {
    try {
      let path = `/api/business-plan/1`;
      let response = await getAxiosInstance().get(path);
      setBusinessPlan(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  const createNewObjective = () => {
    return (
      <Accordion>
        <AccordionSummary sx={{ bgcolor: 'primary.main', display: 'flex' }}>
          <TextField
            id="outlined-basic"
            label="Crear nuevo objetivo"
            variant="outlined"
            sx={{ paddingRight: 10, width: '25%' }}
          />
          <Button variant="outlined" onSubmit={() => saveNewObjective()}>
            Guardar
          </Button>
        </AccordionSummary>
      </Accordion>
    );
  };

  const saveNewObjective = () => {};

  const setState = () => setNewObjective(true);

  const displayObjectives = () => {
    return businessPlan?.objectives.map((objective, index) => {
      return (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="personal-information-content"
            id="personal-information-header"
            sx={{ bgcolor: 'primary.main' }}
          >
            <Card sx={{ width: '100%', bgcolor: 'primary.main', boxShadow: 0, display: 'flex' }}>
              <CardHeader title={objective ? objective.description : 'No data available'} />
              <IconButton
                aria-label="add"
                onClick={() => {
                  if (newObjective) setState(false);
                  if (!newObjective) setState(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Card>
          </AccordionSummary>
          <AccordionDetails>
            <Objective key={objective.id} objective={objective} />
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  if (!newObjective) {
    return displayObjectives();
  } else {
    return (
      <>
        {createNewObjective()}
        {displayObjectives()}
      </>
    );
  }
};

export default Dashboard;

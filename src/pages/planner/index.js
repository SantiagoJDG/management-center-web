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
  const [newObjectiveDescription, setNewObjectiveDescription] = useState('');
  const { userToken, waitingUser, userData } = useAuth();

  const router = useRouter();

  const getBusinessPlan = async () => {
    try {
      let path = `/api/business-plan/1`;
      let response = await getAxiosInstance().get(path);
      console.log(response.data);
      setBusinessPlan(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  const handleNewObjectiveDescription = (event) => {
    setNewObjectiveDescription(event.target.value);
  };

  const createObjectiveObject = () => {
    const { id } = userData;
    const { id: businessPlanId } = businessPlan;
    const objetiveObject = {
      description: newObjectiveDescription,
      author: id,
      businessPlan: businessPlanId
    };
    return objetiveObject;
  };

  const saveNewObjective = async () => {
    try {
      let objetiveObjectPath = 'api/business-plan/objective';
      await getAxiosInstance()
        .post(objetiveObjectPath, createObjectiveObject())
        .then(() => {
          getBusinessPlan();
        });
    } catch (error) {
      console.log('error');
    }
    setNewObjective(false);
  };

  const renderCreateNewObjective = () => {
    if (newObjective) setNewObjective(false);
    if (!newObjective) setNewObjective(true);
  };

  const displayObjectives = () => {
    return businessPlan
      ? businessPlan.business_objectives.map((objective, index) => {
          return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="personal-information-content"
                id="personal-information-header"
                sx={{ bgcolor: 'primary.main' }}
              >
                <Card
                  sx={{ width: '100%', bgcolor: 'primary.main', boxShadow: 0, display: 'flex' }}
                >
                  <CardHeader title={objective ? objective.description : 'No data available'} />
                  <IconButton
                    aria-label="add"
                    onClick={() => {
                      renderCreateNewObjective();
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
        })
      : 'no objectives';
  };

  const createNewObjective = () => {
    return (
      <Accordion expanded={false}>
        <AccordionSummary sx={{ bgcolor: 'primary.main', display: 'flex' }}>
          <TextField
            id="outlined-basic"
            label="Crear nuevo objetivo"
            variant="outlined"
            sx={{ paddingRight: 10, width: '50%' }}
            inputProps={{ maxLength: 500 }}
            value={newObjectiveDescription}
            onChange={handleNewObjectiveDescription}
          />
          <Button variant="outlined" onClick={() => saveNewObjective()}>
            Guardar
          </Button>
        </AccordionSummary>
      </Accordion>
    );
  };

  useEffect(() => {
    if (waitingUser) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }

    getBusinessPlan();
  }, [userToken, waitingUser]);

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

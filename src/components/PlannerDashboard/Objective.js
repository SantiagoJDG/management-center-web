import { Grid, Card, CardHeader } from '@mui/material';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';

const Objective = () => {
  const [objective, setObjective] = useState();
  const { userToken, waitingUser } = useAuth();

  const objectivesMock = {
    id: 1,
    description: 'The Objective in the world',
    goal: [
      {
        id: 1,
        id_objective: 1,
        title: 'My Goal is better than yours',
        goals: [
          'Prepare goal to be better than yoyrs',
          'Make Sure that my goal is better than yours',
          'Look the free man and pass de ball'
        ]
      }
    ],
    strategy: [
      {
        id: 1,
        description: 'Look out for goals which are better than yours'
      },
      {
        id: 2,
        description: 'Look out for goals which are better than yours'
      }
    ]
  };

  const { goals } = objectivesMock;

  const getObjectives = async () => {
    try {
      setObjective(objectivesMock);
      console.log(objectivesMock);
    } catch {
      console.error('TE EQUIVOCASTE MALDITOOOO');
    }
  };

  useEffect(() => {
    if (!userToken) return;

    getObjectives();
  }, [userToken, waitingUser]);

  return (
    <>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader title={objective.description ? objective.description : 'No data available'} />
      </Card>
      <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
        <Grid item lg={3} xl={3}>
          <Goals goals={goals} />
        </Grid>
        <Grid item lg={9} xl={9}>
          <Strategy />
        </Grid>
      </Grid>
    </>
  );
};

export default Objective;

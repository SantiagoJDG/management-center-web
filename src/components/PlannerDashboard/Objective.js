import { Grid, Card, CardHeader } from '@mui/material';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';

const Objective = ({ objectives }) => {
  const { userToken, waitingUser } = useAuth();
  const { goal, strategy } = objectives;
  useEffect(() => {
    if (!userToken) return;
  }, [userToken, waitingUser]);

  return (
    <>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader title={objectives ? objectives.description : 'No data available'} />
      </Card>
      <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
        <Grid item lg={3} xl={3}>
          <Goals goals={goal} />
        </Grid>
        <Grid item lg={9} xl={9}>
          <Strategy strategies={strategy} />
        </Grid>
      </Grid>
    </>
  );
};

export default Objective;

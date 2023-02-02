import { Grid } from '@mui/material';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';
import useAuth from '../../hooks/useAuth';

const Objective = ({ objective, businessPlanObjective }) => {
  const { goals, strategies } = objective;
  const { userData } = useAuth();
  console.log(businessPlanObjective);
  return (
    <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
      <Grid item lg={3} xl={3}>
        <Goals goals={goals} userId={userData.id} businessPlanObjective={businessPlanObjective} />
      </Grid>
      <Grid item lg={9} xl={9}>
        <Strategy strategies={strategies} userId={userData.id} />
      </Grid>
    </Grid>
  );
};

export default Objective;

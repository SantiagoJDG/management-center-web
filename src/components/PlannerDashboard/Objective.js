import { Grid } from '@mui/material';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';

const Objective = ({ objective }) => {
  const { goals, strategies } = objective;

  return (
    <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
      <Grid item lg={3} xl={3}>
        <Goals goals={goals} />
      </Grid>
      <Grid item lg={9} xl={9}>
        <Strategy strategies={strategies} />
      </Grid>
    </Grid>
  );
};

export default Objective;

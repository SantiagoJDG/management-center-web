import Goals from 'components/PlannerDashboard/Goals';
import Objective from 'components/PlannerDashboard/Objective';
import Strategy from 'components/PlannerDashboard/Strategy';
import Measures from 'components/PlannerDashboard/Measures';

import { Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <>
      <Grid container xs={12} gap={1}>
        <Objective />
      </Grid>
      <Grid container direction="row" xs={13} gap={1}>
        <Grid item xs={3}>
          <Goals />
        </Grid>
        <Grid item xs={4}>
          <Strategy />
        </Grid>
        <Grid item xs={4.5}>
          <Measures />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

import { Grid, Card, CardHeader } from '@mui/material';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';

const Objective = () => {
  return (
    <>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader title="My Objective" />
      </Card>
      <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
        <Grid item lg={3} xl={3}>
          <Goals />
        </Grid>
        <Grid item lg={9} xl={9}>
          <Strategy />
        </Grid>
      </Grid>
    </>
  );
};

export default Objective;

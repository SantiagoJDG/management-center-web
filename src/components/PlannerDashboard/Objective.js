import { Grid } from '@mui/material';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';
import useAuth from '../../hooks/useAuth';

const Objective = ({ objective, getBusinessObjective }) => {
  const { id, goalsData, strategiesData } = objective;
  const { userData } = useAuth();
  return (
    <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
      <Grid item sm={12} lg={3}>
        <Goals
          strategies={strategiesData}
          goals={goalsData}
          userId={userData.id}
          businessPlanObjective={id}
          getBusinessObjective={getBusinessObjective}
        />
      </Grid>
      <Grid item sm={12} lg={9}>
        <Strategy
          strategies={strategiesData}
          goals={goalsData}
          userId={userData.id}
          businessPlanObjective={id}
          getBusinessObjective={getBusinessObjective}
        />
      </Grid>
    </Grid>
  );
};

export default Objective;

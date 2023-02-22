import { Grid, Card } from '@mui/material';
import Goals from 'components/PlannerDashboard/Goals';
import Strategy from 'components/PlannerDashboard/Strategy';
import useAuth from '../../hooks/useAuth';

const Objective = ({ objective, getBusinessObjective }) => {
  const { business_goals, business_strategies, id } = objective;
  const { userData } = useAuth();
  return (
    <Grid container sx={{ paddingTop: 1 }} direction="row" spacing={1}>
      <Grid item lg={3} xl={3}>
        <Grid container>
          <Card sx={{ width: '100%' }}>
            <Goals
              goals={business_goals}
              userId={userData.id}
              businessPlanObjective={id}
              getBusinessObjective={getBusinessObjective}
            />
          </Card>
        </Grid>
      </Grid>
      <Grid item lg={9} xl={9}>
        <Strategy
          strategies={business_strategies}
          goals={business_goals}
          userId={userData.id}
          businessPlanObjective={id}
          getBusinessObjective={getBusinessObjective}
        />
      </Grid>
    </Grid>
  );
};

export default Objective;

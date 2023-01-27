import {
  Card,
  Grid,
  CardHeader,
  Avatar,
  CardContent,
  Stack,
  Typography,
  Divider
} from '@mui/material';

const Goals = ({ goals }) => {
  return (
    <Grid container>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          sx={{ bgcolor: 'primary.main' }}
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main' }} aria-label="recipe">
              G
            </Avatar>
          }
          title={'Goals'}
        />
        <CardContent>
          {goals.map((eachGoal, index) => {
            return (
              <Card key={index}>
                <CardHeader subheader={eachGoal.title} />
                <CardContent>
                  <Stack
                    direction="column"
                    spacing={1}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    {eachGoal.goals.map((eachGoalName, index) => {
                      return (
                        <Typography variant="body1" key={index}>
                          {eachGoalName}
                        </Typography>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Goals;

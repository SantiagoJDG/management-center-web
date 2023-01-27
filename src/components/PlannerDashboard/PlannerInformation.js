import { Stack, Card, CardHeader, CardContent, Divider, Typography, Avatar } from '@mui/material';

const PlannerInformation = (Category) => {
  return (
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
  );
};
export default PlannerInformation;

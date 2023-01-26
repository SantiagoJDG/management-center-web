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
  console.log(goals);
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
          {goals.goal.map((eachGoal) => {
            <Card>
              <CardHeader subheader={'My super Goal'} />
              <CardContent>
                <Stack
                  direction="column"
                  spacing={1}
                  divider={<Divider orientation="horizontal" flexItem />}
                >
                  <Typography variant="body1">ciernfne4igt</Typography>
                  <Typography variant="body1">f3f3f3wrf</Typography>
                  <Typography variant="body1">fwerfef4g5pl,</Typography>
                  <Typography variant="body1">k loienq2w3</Typography>
                </Stack>
              </CardContent>
            </Card>;
          })}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Goals;

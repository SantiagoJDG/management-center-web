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
import Actions from './Actions';

const Measures = ({ measures }) => {
  return (
    <Grid container>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'secondary.main' }} aria-label="recipe">
              M
            </Avatar>
          }
          sx={{ bgcolor: 'primary.main' }}
          title={'Measures'}
        />
        <CardContent>
          <Grid container direction={'row'} spacing={1}>
            <Grid item lg={4} xl={4}>
              <Card>
                <CardHeader subheader={'Dashboard'} />
                {measures?.map((eachMeasurable, index) => {
                  return (
                    <Card key={index} sx={{ margin: 0.5 }}>
                      <CardContent>
                        <Stack
                          direction="column"
                          spacing={1}
                          divider={<Divider orientation="horizontal" flexItem />}
                        >
                          {eachMeasurable.measurable_objectives.dashboard.map(
                            (eachMeasurableDescription, index) => {
                              return (
                                <Typography variant="body1" key={index}>
                                  {eachMeasurableDescription}
                                </Typography>
                              );
                            }
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Card>
            </Grid>
            <Grid item lg={8} xl={8}>
              <Actions measures={measures} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Measures;

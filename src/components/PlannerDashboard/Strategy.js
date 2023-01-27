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
import Measures from './Measures';

const Strategy = ({ strategies }) => {
  const measures = [
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      },
      actions: {
        id: 1,
        description: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      }
    },
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      },
      actions: {
        id: 1,
        description: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      }
    }
  ];

  return (
    <Grid container spacing={0.5} direction="row">
      <Grid item lg={4} xl={4}>
        <Card>
          <CardHeader
            sx={{ bgcolor: 'primary.main' }}
            avatar={
              <Avatar sx={{ bgcolor: 'success.main' }} aria-label="recipe">
                S
              </Avatar>
            }
            title={'Strategy'}
          />
          <CardContent>
            <Card>
              <CardHeader subheader={'Strategies'} />
              <CardContent>
                <Stack
                  direction="column"
                  spacing={1}
                  divider={<Divider orientation="horizontal" flexItem />}
                >
                  {strategies.map((eachStrategy, index) => {
                    return (
                      <Typography variant="body1" key={index}>
                        {eachStrategy.description}
                      </Typography>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={8} xl={8}>
        <Measures measures={measures} />
      </Grid>
    </Grid>
  );
};

export default Strategy;

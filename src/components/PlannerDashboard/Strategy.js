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

const Strategy = () => {
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
                  <Typography variant="body1">cnenrieirvie</Typography>
                  <Typography variant="body1">cnenrieirvie</Typography>
                  <Typography variant="body1">cnenrieirvie</Typography>
                  <Typography variant="body1">cnenrieirvie</Typography>
                </Stack>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Grid>
      <Grid item lg={8} xl={8}>
        <Measures />
      </Grid>
    </Grid>
  );
};

export default Strategy;

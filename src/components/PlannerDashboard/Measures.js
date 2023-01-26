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

const Measures = () => {
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
                <CardContent>
                  <Stack
                    direction="column"
                    spacing={1}
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                    <Typography variant="body1">dwefer</Typography>
                    <Typography variant="body1">dwefer</Typography>
                    <Typography variant="body1">dwefer</Typography>
                    <Typography variant="body1">dwefer</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={8} xl={8}>
              <Actions />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Measures;

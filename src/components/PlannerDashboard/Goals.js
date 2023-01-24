import { Card, Grid, CardHeader, Avatar } from '@mui/material';

const Goals = () => {
  return (
    <Grid container>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main' }} aria-label="recipe">
              G
            </Avatar>
          }
          title={'Goals'}
        ></CardHeader>
      </Card>
    </Grid>
  );
};

export default Goals;

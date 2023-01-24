import { Card, Grid, CardHeader, Avatar } from '@mui/material';

const Strategy = () => {
  return (
    <Grid container>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'success.main' }} aria-label="recipe">
              S
            </Avatar>
          }
          title={'Strategy'}
        ></CardHeader>
      </Card>
    </Grid>
  );
};

export default Strategy;

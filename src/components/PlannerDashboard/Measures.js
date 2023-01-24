import { Card, Grid, CardHeader, Avatar } from '@mui/material';

const Measures = () => {
  return (
    <Grid container>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'secondary.main' }} aria-label="recipe">
              M
            </Avatar>
          }
          title={'Measures'}
        ></CardHeader>
      </Card>
    </Grid>
  );
};

export default Measures;

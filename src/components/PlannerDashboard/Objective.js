import { Grid, Card, CardHeader } from '@mui/material';

const Objective = () => {
  return (
    <Grid container sx={{ padding: 1 }}>
      <Card sx={{ width: '100%', bgcolor: 'primary.main' }}>
        <CardHeader title="My Objective" />
      </Card>
    </Grid>
  );
};

export default Objective;

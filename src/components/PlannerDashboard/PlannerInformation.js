import { Stack, Card, CardHeader, CardContent, Divider, Typography } from '@mui/material';

const PlannerInformation = () => {
  return (
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
    </Card>
  );
};
export default PlannerInformation;

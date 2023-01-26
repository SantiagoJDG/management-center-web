import { Card, CardHeader, CardContent, Stack, Typography, Divider } from '@mui/material';

const Actions = () => {
  return (
    <Card>
      <CardHeader subheader={'Actions'} />
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
  );
};

export default Actions;

import { Card, CardHeader, CardContent, Stack, Typography, Divider } from '@mui/material';

const Actions = ({ measures }) => {
  return (
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
                {eachMeasurable.actions.description.map((actionsDescription, index) => {
                  return (
                    <Typography variant="body1" key={index}>
                      {actionsDescription}
                    </Typography>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Card>
  );
};

export default Actions;

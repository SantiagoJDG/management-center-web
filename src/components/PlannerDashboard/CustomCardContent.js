import { Card, CardContent, Stack, Typography, Grid, CardHeader, Divider } from '@mui/material';

const CustomCardContent = ({ array, editable }) => {
  return array
    ? array.map((eachItem, index) => {
        const { authorData, id } = eachItem;
        return (
          <Card key={index} sx={{ margin: 0.5 }}>
            {eachItem.categoryData ? <CardHeader subheader={eachItem.categoryData.name} /> : ''}
            <CardContent>
              <Stack
                direction="column"
                spacing={1}
                divider={<Divider orientation="horizontal" flexItem />}
              >
                <Typography variant="body1" key={index}>
                  {eachItem.description}
                </Typography>
              </Stack>
            </CardContent>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              {editable(authorData, id)}
            </Grid>
          </Card>
        );
      })
    : 'No existen metas creadas';
};

export default CustomCardContent;

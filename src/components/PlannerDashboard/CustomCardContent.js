import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CustomCardContent = ({
  category,
  eachObject,
  userData,
  handleClickOpenDeleteDialog,
  handleClickOpenEditDialog
}) => {
  const editableStrategy = (eachObject) => {
    if (eachObject.authorData.id === userData.id) {
      return (
        <>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton onClick={() => handleClickOpenDeleteDialog(eachObject)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item justifySelf="end">
              <IconButton onClick={() => handleClickOpenEditDialog(eachObject)}>
                <EditIcon />
              </IconButton>
            </Grid>
          </Grid>
        </>
      );
    } else {
      return;
    }
  };

  return (
    <CardContent sx={{ width: '100%' }}>
      <Card sx={{ margin: 0.5 }}>
        {category ? <CardHeader subheader={category.name} /> : ''}
        <CardContent>
          <Stack
            direction="column"
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            <Typography variant="body1">{eachObject.description}</Typography>
          </Stack>
        </CardContent>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {editableStrategy(eachObject)}
        </Grid>
      </Card>
    </CardContent>
  );
};

export default CustomCardContent;

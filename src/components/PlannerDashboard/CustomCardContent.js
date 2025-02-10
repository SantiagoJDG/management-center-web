import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';

import useAuth from 'hooks/useAuth';

const CustomCardContent = ({
  category,
  selectedObject,
  handleClickOpenDeleteDialog,
  handleClickOpenEditDialog
}) => {
  const { userData } = useAuth();

  const editableStrategy = (eachObject) => {
    if (eachObject.authorData && eachObject.authorData.id === userData.id) {
      return (
        <>
          <Grid container direction="row" justifyContent="right" alignItems="center">
            <Grid item>
              <IconButton onClick={() => handleClickOpenDeleteDialog(eachObject)}>
                <DeleteIcon style={{ color: '#03a9f4' }} />
              </IconButton>
            </Grid>
            <Grid item justifySelf="end">
              <IconButton onClick={() => handleClickOpenEditDialog(eachObject)}>
                <BorderColorSharpIcon style={{ color: '#03a9f4' }} />
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
        {category ? (
          <CardHeader
            subheader={
              <Chip variant="outlined" color="primary" label={`Estrategia: ${category}`} />
            }
            action={editableStrategy(selectedObject)}
          />
        ) : (
          editableStrategy(selectedObject)
        )}
        <CardContent>
          <Stack
            direction="column"
            spacing={1}
            divider={<Divider orientation="horizontal" flexItem />}
          >
            <Typography sx={{ fontWeight: 'bold' }} variant="body1" color={'#03a9f4'}>
              {selectedObject.description}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </CardContent>
  );
};

export default CustomCardContent;

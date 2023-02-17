import {
  Card,
  Grid,
  CardHeader,
  Avatar,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  Autocomplete,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Actions from './Actions';
import CustomDialog from './CustomDialog';
import useToggle from 'hooks/useToggle';
import useCreate from 'hooks/useCreate';

const Measures = ({ measures, strategies, userId, getBusinessObjective }) => {
  const [openDialog, setOpenDialog] = useToggle(false);
  const [newObject, setNewObject] = useState({
    description: '',
    strategy: null,
    author: userId
  });
  const [create] = useCreate('/api/business-plan/strategy/businessKpi', newObject);

  async function handleCategory(value) {
    const strategyId = strategies.find((goal) => goal.description === value);
    setNewObject({ ...newObject, strategy: strategyId.id });
  }

  const createGoal = async () => {
    create();
    setOpenDialog(false);
    getBusinessObjective();
  };

  const renderStrategiesDropdown = () => {
    return (
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={strategies.map((strategy) => strategy.description)}
        onChange={handleCategory}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Metas"
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
      />
    );
  };

  return (
    <>
      <Grid container>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'secondary.main' }} aria-label="recipe">
                M
              </Avatar>
            }
            sx={{ bgcolor: 'primary.main' }}
            title={'Metricas'}
          />
          <CardContent>
            <Grid container direction={'row'} spacing={1}>
              <Grid item lg={4} xl={4}>
                <Card>
                  <CardHeader
                    subheader={'Indicador de gestión'}
                    action={
                      <IconButton aria-label="settings" onClick={setOpenDialog}>
                        <AddIcon />
                      </IconButton>
                    }
                  />

                  {measures?.map((eachMeasurable, index) => {
                    return (
                      <Card key={index} sx={{ margin: 0.5 }}>
                        <CardContent>
                          <Stack
                            direction="column"
                            spacing={1}
                            divider={<Divider orientation="horizontal" flexItem />}
                          >
                            {eachMeasurable.measurable_objectives.dashboard.map(
                              (eachMeasurableDescription, index) => {
                                return (
                                  <Typography variant="body1" key={index}>
                                    {eachMeasurableDescription}
                                  </Typography>
                                );
                              }
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Card>
              </Grid>
              <Grid item lg={8} xl={8}>
                <Actions measures={measures} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <CustomDialog
        open={openDialog}
        title={'Indicador de gestión'}
        handleClose={setOpenDialog}
        requestMethod={createGoal}
        displayDropdown={renderStrategiesDropdown()}
        nameMethod={'create'}
      />
    </>
  );
};

export default Measures;

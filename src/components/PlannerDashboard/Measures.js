import {
  Card,
  Grid,
  CardHeader,
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
import useOnOffSwitch from 'hooks/useOnOffSwitch';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';

const Measures = ({ strategy, strategies, userId, getBusinessObjective }) => {
  const [openDialog, setOpenDialog] = useOnOffSwitch(false);
  const [open, setOpen] = useState(false);
  const [newMeasure, setNewMeasure] = useState({
    description: '',
    businessStrategy: null,
    author: userId
  });
  const [create] = useCreate('/api/business-plan/kpi', newMeasure);
  const { handleNewMessage } = useMessage();

  async function handleCategory(event, value) {
    const strategyId = strategies.find((goal) => goal.description === value);
    setNewMeasure({ ...newMeasure, businessStrategy: strategyId.id });
  }

  const createMeasure = async () => {
    if (newMeasure.description == '' || newMeasure.businessStrategy < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una métrica valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await create();
    if (error) return;
    await getBusinessObjective();
    setOpenDialog(false);
    setNewMeasure({ ...newMeasure, description: '', businessStrategy: null });
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
            label="Strategias"
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
      />
    );
  };

  // const openActionsDialog = () => {
  //   return setOpen;
  // };

  return (
    <>
      <CardContent>
        <Grid container direction={'row'} spacing={0.5}>
          <Grid item sm={6}>
            <CardHeader
              subheader={'Indicador de gestión'}
              action={
                <IconButton aria-label="settings" onClick={setOpenDialog}>
                  <AddIcon />
                </IconButton>
              }
            />
          </Grid>
          <Grid item sm={6}>
            <CardHeader
              subheader={'Planes de accion'}
              action={
                <IconButton aria-label="settings" onClick={() => setOpen(true)}>
                  <AddIcon />
                </IconButton>
              }
            />
          </Grid>

          {strategy.kpisData
            ? strategy.kpisData.map((kpi, index) => {
                return (
                  <Grid container key={index} direction={'row'} spacing={0.5}>
                    <Grid item sm={6}>
                      <Card sx={{ margin: 0.5 }}>
                        <CardContent>
                          <Stack
                            direction="column"
                            spacing={1}
                            divider={<Divider orientation="horizontal" flexItem />}
                          >
                            <Typography variant="body1" key={index}>
                              {kpi.description}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item sm={6}>
                      <Actions
                        actions={
                          kpi.actionData
                            ? kpi.actionData.map((actionData) => {
                                return actionData;
                              })
                            : ''
                        }
                        strategy={strategy}
                        openDialog={setOpen}
                        dialogState={open}
                      />
                    </Grid>
                  </Grid>
                );
              })
            : 'Actualmente no hay kpis creadas'}
        </Grid>
      </CardContent>
      <CustomDialog
        open={openDialog}
        title={'Indicador de gestión'}
        handleClose={setOpenDialog}
        requestMethod={createMeasure}
        displayDropdown={renderStrategiesDropdown()}
        newObject={newMeasure}
        setNewObject={setNewMeasure}
        nameMethod={'create'}
      />
    </>
  );
};

export default Measures;

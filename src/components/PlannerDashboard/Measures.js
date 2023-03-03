import {
  Card,
  Grid,
  CardContent,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  TextField
} from '@mui/material';
import { useState } from 'react';
import Actions from './Actions';
import CustomDialog from './CustomDialog';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';

const Measures = ({
  strategy,
  strategies,
  userId,
  getBusinessObjective,
  openActionsDialog,
  setOpenActionsDialog,
  setOpenMeasureDialog,
  openMeasureDialog
}) => {
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
    setOpenMeasureDialog(false);
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

  return (
    <>
      <CardContent>
        <Grid container direction={'row'} spacing={0.5}>
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
                        actions={kpi.actionData}
                        userId={userId}
                        getBusinessObjective={getBusinessObjective}
                        strategy={strategy}
                        setOpenActionsDialog={setOpenActionsDialog}
                        openActionsDialog={openActionsDialog}
                      />
                    </Grid>
                  </Grid>
                );
              })
            : 'Actualmente no hay kpis creadas'}
        </Grid>
      </CardContent>
      <CustomDialog
        open={openMeasureDialog}
        title={'Indicador de gestión'}
        handleClose={() => setOpenMeasureDialog(false)}
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

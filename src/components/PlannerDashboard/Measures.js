import {
  Card,
  Grid,
  CardContent,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  CardHeader,
  Avatar,
  SpeedDial,
  SpeedDialAction,
  Chip
} from '@mui/material';
import { useState } from 'react';
import Actions from './Actions';
import CustomDialog from './CustomDialog';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';

import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AddIcon from '@mui/icons-material/Add';

const Measures = ({
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

  const actions = [
    {
      icon: <PendingActionsIcon />,
      name: 'Crear Planes de Accion',
      action: () => setOpenActionsDialog(true)
    },
    {
      icon: <FormatListNumberedIcon />,
      name: 'Crear Indicador de Gestion',
      action: () => setOpenMeasureDialog(true)
    }
  ];

  const dial = () => {
    return (
      <SpeedDial
        ariaLabel="SpeedDial"
        direction="left"
        icon={<AddIcon />}
        sx={{
          '& .MuiFab-primary': { width: 40, height: 40 },
          position: 'static'
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            onClick={action.action}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            sx={{ width: 40, height: 40, boxSizing: 'border-box' }}
          />
        ))}
      </SpeedDial>
    );
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
    <Card>
      <CardHeader
        sx={{ bgcolor: '#03a9f4', color: 'info.contrastText', paddingTop: 1 }}
        avatar={
          <Avatar sx={{ bgcolor: 'White' }} aria-label="recipe">
            <QueryStatsIcon color="primary" />
          </Avatar>
        }
        title={'Metricas'}
        action={dial()}
      />
      <CardContent>
        <Grid container direction={'row'} spacing={0.5}>
          {strategies
            ? strategies.map((strategy) => {
                return strategy.kpisData
                  ? strategy.kpisData.map((kpi, index) => {
                      return (
                        <Grid container key={index} direction={'row'} spacing={0.5}>
                          <Grid item sm={6}>
                            <Card sx={{ margin: 0.5 }}>
                              <CardHeader
                                subheader={
                                  <Chip
                                    color="primary"
                                    variant="outlined"
                                    label={`Estrategia: ${strategy.id}`}
                                  />
                                }
                              />
                              <CardContent>
                                <Stack
                                  direction="column"
                                  spacing={1}
                                  divider={<Divider orientation="horizontal" flexItem />}
                                >
                                  <Typography variant="body1" key={index} color={'#03a9f4'}>
                                    <b>{kpi.description}</b>
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
                  : 'Actualmente no hay Kpis Creadas';
              })
            : 'Actualmente no hay estrategias'}
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
    </Card>
  );
};

export default Measures;

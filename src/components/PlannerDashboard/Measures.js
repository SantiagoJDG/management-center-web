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
  IconButton,
  SpeedDialAction,
  Chip
} from '@mui/material';
import { useState } from 'react';
import Actions from './Actions';
import CustomDialog from './CustomDialog';
import useCreate from 'hooks/useCreate';
import useMessage from 'hooks/useMessage';

import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';

import useDelete from 'hooks/useDelete';
import useEdit from 'hooks/useEdit';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AddIcon from '@mui/icons-material/Add';
import useAuth from 'hooks/useAuth';
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

  const { userData } = useAuth();
  const [create] = useCreate('/api/business-plan/kpi', newMeasure);
  const [edit] = useEdit(`/api/business-plan/kpi/${newMeasure.id}`, newMeasure);
  const [deletion] = useDelete(`/api/business-plan/kpi/${newMeasure.id}`);

  const { handleNewMessage } = useMessage();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToEdited, setCategoryToEdited] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);

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

  function hanldeCloseDialog(methodToClose) {
    setNewMeasure({ ...newMeasure, description: '', businessStrategy: null });
    setCategoryToEdited();
    methodToClose(false);
  }

  const editMeasure = async () => {
    if (newMeasure.description == '' || newMeasure.category < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una meta valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await edit();
    if (error) return;
    await getBusinessObjective();
    setOpenEditDialog(false);
    setNewMeasure({ ...newMeasure, description: '', businessStrategy: null });
  };

  const deleteMeasure = async () => {
    const error = await deletion();
    if (error) return;
    await getBusinessObjective();
    setOpenDeleteDialog(false);
    setNewMeasure({ ...newMeasure, description: '', businessStrategy: null });
  };

  const renderStrategiesDropdown = () => {
    return (
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        defaultValue={categoryToEdited}
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

  const handleClickOpenDeleteDialog = (measures) => {
    setNewMeasure({
      id: measures.id,
      description: measures.description
    });
    setOpenDeleteDialog(true);
  };

  const handleClickOpenEditDialog = (measures) => {
    const strategy = strategies.find((strategy) => {
      return strategy.kpisData.find((kpi) => {
        return kpi.id === measures.id;
      });
    });

    setCategoryToEdited(strategy.description);
    setNewMeasure({
      id: measures.id,
      description: measures.description,
      businessStrategy: strategy.id,
      author: userId
    });

    setOpenEditDialog(true);
  };

  const editableMeasures = (measures) => {
    if (measures.authorData.id === userData.id) {
      return (
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton onClick={() => handleClickOpenDeleteDialog(measures)}>
              <DeleteIcon style={{ color: '#03a9f4' }} />
            </IconButton>
          </Grid>
          <Grid item justifySelf="end">
            <IconButton aria-label="edit" onClick={() => handleClickOpenEditDialog(measures)}>
              <BorderColorSharpIcon style={{ color: '#03a9f4' }} />
            </IconButton>
          </Grid>
        </Grid>
      );
    } else {
      return;
    }
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
                            <Card key={index} sx={{ margin: 0.5 }}>
                              {kpi.description ? (
                                <CardHeader
                                  action={editableMeasures(kpi)}
                                  subheader={
                                    <Chip
                                      color="primary"
                                      variant="outlined"
                                      label={`Estrategia: ${strategy.id}`}
                                    />
                                  }
                                />
                              ) : (
                                ''
                              )}
                              <CardContent>
                                <Stack
                                  direction="column"
                                  spacing={1}
                                  divider={<Divider orientation="horizontal" flexItem />}
                                >
                                  <Typography
                                    sx={{ fontWeight: 'bold' }}
                                    color={'#03a9f4'}
                                    variant="body1"
                                    key={index}
                                  >
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
      <CustomDialog
        nameMethod={'delete'}
        title={'Eliminación de Indicadores'}
        open={openDeleteDialog}
        handleClose={() => hanldeCloseDialog(setOpenDeleteDialog)}
        requestMethod={deleteMeasure}
        newObject={newMeasure}
      />

      <CustomDialog
        nameMethod={'edit'}
        title={'Edición de meta seleccionada'}
        open={openEditDialog}
        handleClose={() => hanldeCloseDialog(setOpenEditDialog)}
        displayDropdown={renderStrategiesDropdown()}
        requestMethod={editMeasure}
        newObject={newMeasure}
        setNewObject={setNewMeasure}
      />
    </Card>
  );
};

export default Measures;

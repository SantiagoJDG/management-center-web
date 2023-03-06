import { Grid, Autocomplete, TextField, CardHeader, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useState } from 'react';
import Measures from './Measures';
import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import CustomCardHeader from './CustomCardHeader';
import useOnOffSwitch from 'hooks/useOnOffSwitch';
import useCreate from 'hooks/useCreate';
import useEdit from 'hooks/useEdit';
import useDelete from 'hooks/useDelete';
import useMessage from 'hooks/useMessage';

import CustomCardContent from './CustomCardContent';

const Strategy = ({ strategies, goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const { handleNewMessage } = useMessage();
  const [strategyDescriptionToEdit, setStrategyDescriptionToEdit] = useState();
  const [openActionsDialog, setOpenActionsDialog] = useState(false);
  const [openMeasureDialog, setOpenMeasureDialog] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useOnOffSwitch();
  const [openEditDialog, setOpenEditDialog] = useOnOffSwitch();
  const [openDeleteDialog, setOpenDeleteDialog] = useOnOffSwitch();

  const [selectedStrategy, setSelectedStrategy] = useState({
    description: '',
    businessGoal: null,
    author: userId,
    businessObjectiveId: businessPlanObjective
  });

  const [create] = useCreate('/api/business-plan/strategy', selectedStrategy);
  const [edit] = useEdit(
    `/api/business-plan/strategy/${selectedStrategy.businessGoal}`,
    selectedStrategy
  );
  const [deletion] = useDelete(`/api/business-plan/strategy/${selectedStrategy.businessGoal}`);

  async function handleGoalSelected(event, value) {
    const goalId = goals.find((goal) => goal.description === value);
    setSelectedStrategy({ ...selectedStrategy, businessGoal: goalId.id });
  }

  const createGoal = async () => {
    create();
    setOpenCreateDialog(false);
    getBusinessObjective();
  };

  const handleClickOpenEditDialog = (strategy) => {
    setStrategyDescriptionToEdit(strategy.businessGoalData.description);
    setSelectedStrategy({
      businessGoal: strategy.id,
      description: strategy.description,
      author: userId,
      businessObjectiveId: businessPlanObjective
    });

    setOpenEditDialog(true);
  };

  const editStrategy = async () => {
    if (selectedStrategy.description == '' || selectedStrategy.category < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una strategia valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await edit();
    if (error) return;
    await getBusinessObjective();
    setOpenEditDialog(false);
    setSelectedStrategy({
      ...selectedStrategy,
      description: '',
      category: null,
      businessGoal: null
    });
  };

  const handleClickOpenDeleteDialog = (eachStrategy) => {
    setSelectedStrategy({
      businessGoal: eachStrategy.id,
      description: eachStrategy.description,
      author: userId,
      businessObjectiveId: businessPlanObjective
    });
    setOpenDeleteDialog(true);
  };

  function hanldeCloseDialog(methodToClose) {
    setSelectedStrategy({ ...selectedStrategy, description: '', businessGoal: null });
    methodToClose(false);
  }

  const deleteStrategy = async () => {
    const error = await deletion();
    if (error) return;
    await getBusinessObjective();
    setOpenDeleteDialog(false);
    setSelectedStrategy({ ...selectedStrategy, description: '', businessGoal: null });
  };

  const renderGoalsDropdown = () => {
    const goalsDescription = goals.map((goal) => goal.description);
    return (
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        defaultValue={strategyDescriptionToEdit}
        options={goalsDescription}
        onChange={handleGoalSelected}
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
      <Grid direction={'row'} spacing={0.5}>
        <Grid container sm={12} sx={{ display: 'flex' }} spacing={0.5}>
          <Grid item sm={4}>
            <CustomCardHeader
              title={'Estrategias'}
              initialLetter={'E'}
              onClickMethod={setOpenCreateDialog}
              avatarColor={'success.main'}
            />
          </Grid>
          <Grid item sm={8}>
            <CustomCardHeader
              title={'Metricas'}
              initialLetter={'M'}
              avatarColor={'secondary.main'}
            />
            <Grid container direction={'row'} spacing={0.5}>
              <Grid item sm={6}>
                <CardHeader
                  subheader={'Indicador de gestión'}
                  action={
                    <IconButton aria-label="settings" onClick={() => setOpenMeasureDialog(true)}>
                      <AddIcon />
                    </IconButton>
                  }
                />
              </Grid>
              <Grid item sm={6}>
                <CardHeader
                  subheader={'Planes de accion'}
                  action={
                    <IconButton aria-label="settings" onClick={() => setOpenActionsDialog(true)}>
                      <AddIcon />
                    </IconButton>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          {strategies
            ? strategies.map((eachStrategy, index) => {
                return (
                  <Grid container direction={'row'} key={index}>
                    <Grid item sm={4}>
                      <CustomCardContent
                        category={eachStrategy.strategyCategoryData}
                        selectedObject={eachStrategy}
                        handleClickOpenDeleteDialog={handleClickOpenDeleteDialog}
                        handleClickOpenEditDialog={handleClickOpenEditDialog}
                      />
                    </Grid>
                    <Grid item sm={8}>
                      <Measures
                        strategy={eachStrategy}
                        strategies={strategies}
                        userId={userId}
                        getBusinessObjective={getBusinessObjective}
                        openActionsDialog={openActionsDialog}
                        setOpenActionsDialog={setOpenActionsDialog}
                        setOpenMeasureDialog={setOpenMeasureDialog}
                        openMeasureDialog={openMeasureDialog}
                      />
                    </Grid>
                  </Grid>
                );
              })
            : 'No strategies'}
        </Grid>
      </Grid>

      <CustomDialog
        open={openCreateDialog}
        title={'Estrategias'}
        handleClose={setOpenCreateDialog}
        displayDropdown={renderGoalsDropdown()}
        requestMethod={createGoal}
        newObject={selectedStrategy}
        setNewObject={setSelectedStrategy}
        nameMethod={'create'}
      />

      <CustomDialog
        nameMethod={'delete'}
        title={'Eliminación de estrategia'}
        open={openDeleteDialog}
        handleClose={() => hanldeCloseDialog(setOpenDeleteDialog)}
        requestMethod={deleteStrategy}
        newObject={selectedStrategy}
      />

      <CustomDialog
        nameMethod={'edit'}
        title={'Edición de estrategia seleccionada'}
        open={openEditDialog}
        handleClose={() => hanldeCloseDialog(setOpenEditDialog)}
        displayDropdown={renderGoalsDropdown()}
        requestMethod={editStrategy}
        newObject={selectedStrategy}
        setNewObject={setSelectedStrategy}
      />
    </>
  );
};

export default Strategy;

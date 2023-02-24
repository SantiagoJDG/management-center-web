import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  IconButton,
  Divider,
  Autocomplete,
  TextField
} from '@mui/material';
import { useState } from 'react';
import Measures from './Measures';
import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import CustomCardHeader from './CustomCardHeader';
import useOnOffSwitch from 'hooks/useOnOffSwitch';
import useCreate from 'hooks/useCreate';
import useEdit from 'hooks/useEdit';
import useDelete from 'hooks/useDelete';
import useMessage from 'hooks/useMessage';
import useAuth from 'hooks/useAuth';

const Strategy = ({ strategies, goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const measures = [
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: []
      },
      actions: {
        id: 1,
        description: []
      }
    },
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: []
      },
      actions: {
        id: 1,
        description: []
      }
    }
  ];
  const { userData } = useAuth();
  const { handleNewMessage } = useMessage();

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
    setSelectedStrategy({
      businessGoalId: strategy.id,
      description: strategy.description,
      author: userId,
      businessObjective: businessPlanObjective
    });

    setOpenEditDialog(true);
  };

  const editStrategy = async () => {
    if (selectedStrategy.description == '' || selectedStrategy.category < 1) {
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

  const editableStrategy = (eachStrategy) => {
    if (eachStrategy.authorData.id === userData.id) {
      return (
        <>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton onClick={() => handleClickOpenDeleteDialog(eachStrategy)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item justifySelf="end">
              <IconButton onClick={() => handleClickOpenEditDialog(eachStrategy)}>
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
    <>
      <Grid container spacing={0.5} direction="row">
        <Grid item lg={4} xl={4}>
          <Card sx={{ minHeight: '100%' }}>
            <CustomCardHeader
              title={'Estrategias'}
              initialLetter={'E'}
              onClickMethod={setOpenCreateDialog}
              avatarColor={'success.main'}
            />
            <CardContent>
              {strategies
                ? strategies.map((eachStrategy, index) => {
                    return (
                      <Card key={index} sx={{ margin: 0.5 }}>
                        {eachStrategy.strategyCategoryData ? (
                          <CardHeader subheader={eachStrategy.strategyCategoryData.name} />
                        ) : (
                          ''
                        )}
                        <CardContent>
                          <Stack
                            direction="column"
                            spacing={1}
                            divider={<Divider orientation="horizontal" flexItem />}
                          >
                            <Typography variant="body1">{eachStrategy.description}</Typography>
                          </Stack>
                        </CardContent>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {editableStrategy(eachStrategy)}
                        </Grid>
                      </Card>
                    );
                  })
                : 'No strategies'}
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={8} xl={8}>
          <Measures
            measures={measures}
            strategies={strategies}
            userId={userId}
            getBusinessObjective={getBusinessObjective}
          />
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

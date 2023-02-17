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
import Measures from './Measures';
import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import useToggle from 'hooks/useToggle';
import useCreate from 'hooks/useCreate';

const Strategy = ({ strategies, goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const measures = [
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      },
      actions: {
        id: 1,
        description: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      }
    },
    {
      id: 1,
      strategy_id: 1,
      measurable_objectives: {
        id: 1,
        dashboard: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      },
      actions: {
        id: 1,
        description: [
          'ahora estamos lograndolo',
          'giran como astros solares',
          'lava en mi aerde como volcanes'
        ]
      }
    }
  ];
  const [openDialog, setOpenDialog] = useToggle();
  const [newObject, setNewObject] = useState({
    description: '',
    goal: null,
    author: userId,
    businessObjective: businessPlanObjective
  });
  const [create] = useCreate('/api/business-plan/strategy', newObject);

  async function handleCategory(event, value) {
    const goalId = goals.find((goal) => goal.description === value);
    setNewObject({ ...newObject, goal: goalId.id });
  }

  const renderGoalsDropdown = () => {
    const goalsDescription = goals.map((goal) => goal.description);
    return (
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={goalsDescription}
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

  const createGoal = async () => {
    create();
    setOpenDialog(false);
    getBusinessObjective();
  };

  return (
    <>
      <Grid container spacing={0.5} direction="row">
        <Grid item lg={4} xl={4}>
          <Card sx={{ minHeight: '100%' }}>
            <CardHeader
              sx={{ bgcolor: 'primary.main' }}
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }} aria-label="recipe">
                  S
                </Avatar>
              }
              title={'Strategias'}
              action={
                <IconButton aria-label="settings" onClick={setOpenDialog}>
                  <AddIcon />
                </IconButton>
              }
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
                      </Card>
                    );
                  })
                : 'No strategies'}
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={8} xl={8}>
          <Measures measures={measures} strategies={strategies} userId={userId} />
        </Grid>
      </Grid>
      <CustomDialog
        open={openDialog}
        title={'Estrategias'}
        handleClose={setOpenDialog}
        displayDropdown={renderGoalsDropdown()}
        requestMethod={createGoal}
        newObject={newObject}
        setNewObject={setNewObject}
        nameMethod={'create'}
      />
    </>
  );
};

export default Strategy;

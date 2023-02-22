import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Stack,
  Typography,
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
  const [openDialog, setOpenDialog] = useOnOffSwitch();
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

  const createGoal = async () => {
    create();
    setOpenDialog(false);
    getBusinessObjective();
  };

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

  return (
    <>
      <Grid container spacing={0.5} direction="row">
        <Grid item lg={4} xl={4}>
          <Card sx={{ minHeight: '100%' }}>
            <CustomCardHeader
              title={'Estrategias'}
              initial={'E'}
              onClickMethod={setOpenDialog}
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

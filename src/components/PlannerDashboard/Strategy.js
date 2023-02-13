import {
  Card,
  Grid,
  CardHeader,
  Avatar,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import { getAxiosInstance } from 'utils/axiosClient';
import Measures from './Measures';

import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import CustomAutoComplete from 'components/CustomAutoComplete';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [newObject, setNewObject] = useState({
    description: '',
    goal: null,
    author: userId,
    businessObjective: businessPlanObjective
  });

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  async function handleCategory(goal) {
    setNewObject({ ...newObject, goal: goal.id });
  }

  const renderGoalsDropdown = () => {
    const goalsDescription = goals.map((goal) => goal.description);
    return (
      <CustomAutoComplete
        name="categoryid"
        label="Selecciona una Meta"
        optionList={goalsDescription}
        elmentCallback={handleCategory}
        requiredField={true}
      />
    );
  };

  const saveNew = async () => {
    try {
      let objetiveObjectPath = '/api/business-plan/strategy';
      await getAxiosInstance()
        .post(objetiveObjectPath, newObject)
        .then(() => {
          handleClickCloseDialog();
          getBusinessObjective();
        });
    } catch (error) {
      console.log('error');
    }
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
              title={'Strategy'}
              action={
                <IconButton aria-label="settings" onClick={() => handleClickOpenDialog()}>
                  <AddIcon />
                </IconButton>
              }
            />
            <CardContent>
              {strategies
                ? strategies.map((eachStrategy, index) => {
                    return (
                      <Card key={index} sx={{ boxShadow: 0 }}>
                        {eachStrategy.strategyCategoryData ? (
                          <CardHeader subheader={eachStrategy.strategyCategoryData.name} />
                        ) : (
                          'no data'
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
          <Measures measures={measures} />
        </Grid>
      </Grid>
      <CustomDialog
        open={openDialog}
        title={'Estrategias'}
        handleClose={handleClickCloseDialog}
        displayDropdown={renderGoalsDropdown()}
        saveNew={saveNew}
        newObject={newObject}
        setNewObject={setNewObject}
      />
    </>
  );
};

export default Strategy;

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

import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import CustomAutoComplete from 'components/CustomAutoComplete';
import CreateDialog from 'components/PlannerDashboard/CreateDialog';

const Goals = ({ goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState();
  const [newObject, setNewObject] = useState({
    description: '',
    category: null,
    author: userId,
    businessObjective: businessPlanObjective
  });

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  const getCategories = async () => {
    try {
      let path = `/api/business-plan/goal/category`;
      let response = await getAxiosInstance().get(path);
      setCategories(response.data);
    } catch {
      console.error('ERROR');
    }
  };

  async function handleCategory(goal) {
    setNewObject({ ...newObject, category: goal.id });
    if (!goal) return;
    if (!goal.id) {
      let idReturned = await saveNewItem('/api/business-plan/goal', goal);
      goal.id = idReturned;
      setCategories([...categories, goal]);
    }
    setNewObject({ ...newObject, category: goal.id });
  }

  async function saveNewItem(paths, newItem) {
    try {
      let createdItem = await getAxiosInstance().post('/api/business-plan/goal/category', newItem);
      return createdItem.data.id;
    } catch (error) {
      console.error('Error while save new item...', error);
    }
  }

  const saveNew = async () => {
    try {
      let objetiveObjectPath = '/api/business-plan/goal';
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

  const renderCategoryDropdown = () => {
    return (
      <CustomAutoComplete
        name="categoryid"
        label="Categorias"
        optionList={categories}
        elmentCallback={handleCategory}
        requiredField={true}
      />
    );
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Grid container>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            sx={{ bgcolor: 'primary.main' }}
            avatar={
              <Avatar sx={{ bgcolor: 'warning.main' }} aria-label="recipe">
                G
              </Avatar>
            }
            title={'Goals'}
            action={
              <IconButton aria-label="settings" onClick={() => handleClickOpenDialog()}>
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            {goals
              ? goals.map((eachGoal, index) => {
                  return (
                    <Card key={index} sx={{ margin: 0.5 }}>
                      {eachGoal.categoryData ? (
                        <CardHeader subheader={eachGoal.categoryData.name} />
                      ) : (
                        ''
                      )}
                      <CardContent>
                        <Stack
                          direction="column"
                          spacing={1}
                          divider={<Divider orientation="horizontal" flexItem />}
                        >
                          <Typography variant="body1" key={index}>
                            {eachGoal.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })
              : 'No existen metas creadas'}
          </CardContent>
        </Card>
      </Grid>
      <CreateDialog
        open={openDialog}
        title={'Meta'}
        handleClose={handleClickCloseDialog}
        displayDropdown={renderCategoryDropdown()}
        saveNew={saveNew}
        newObject={newObject}
        setNewObject={setNewObject}
      />
    </>
  );
};

export default Goals;

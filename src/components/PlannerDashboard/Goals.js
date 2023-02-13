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
import useAuth from 'hooks/useAuth';

import { getAxiosInstance } from 'utils/axiosClient';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import CustomAutoComplete from 'components/CustomAutoComplete';
import CreateDialog from 'components/PlannerDashboard/CreateDialog';

const Goals = ({ goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const { userData } = useAuth();
  const [openCreateDialog, setCreateOpenDialog] = useState(false);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [goalIdSelected, setGoalSelected] = useState();
  const [categories, setCategories] = useState();
  const [newObject, setNewObject] = useState({
    description: '',
    category: null,
    author: userId,
    businessObjective: businessPlanObjective
  });

  const handleClickOpenCreateDialog = () => {
    setCreateOpenDialog(true);
  };

  const handleClickOpenDeleteDialog = (idGoal) => {
    setGoalSelected(idGoal);
    setDeleteOpenDialog(true);
  };

  const handleClickOpenEditDialog = (idGoal) => {
    setGoalSelected(idGoal);
    setCreateOpenDialog(true);
  };

  const handleClickCloseCreateDialog = () => {
    setCreateOpenDialog(false);
  };

  const handleClickCloseDeleteDialog = () => {
    setDeleteOpenDialog(false);
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
          handleClickCloseCreateDialog();
          getBusinessObjective();
        });
    } catch (error) {
      console.log('error');
    }
  };

  const deleteGoal = async () => {
    try {
      let objetiveObjectPath = `/api/business-plan/goal/${goalIdSelected}`;
      await getAxiosInstance()
        .delete(objetiveObjectPath, newObject)
        .then(() => {
          handleClickCloseCreateDialog();
          getBusinessObjective();
        });
    } catch (error) {
      console.log('error');
    }
  };

  const editGoal = async () => {
    try {
      let objetiveObjectPath = `/api/business-plan/goal/${goalIdSelected}`;
      await getAxiosInstance()
        .put(objetiveObjectPath, newObject)
        .then(() => {
          handleClickCloseCreateDialog();
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

  const editableGoal = (authorData, idGoal) => {
    const { id } = authorData;
    if (id === userData.id) {
      return (
        <>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton onClick={() => handleClickOpenDeleteDialog(idGoal)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item justifySelf="end">
              <IconButton onClick={() => handleClickOpenEditDialog(idGoal)}>
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
              <IconButton aria-label="settings" onClick={() => handleClickOpenCreateDialog()}>
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            {goals
              ? goals.map((eachGoal, index) => {
                  const { authorData } = eachGoal;
                  const { id: idGoal } = eachGoal;
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
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {editableGoal(authorData, idGoal)}
                      </Grid>
                    </Card>
                  );
                })
              : 'No existen metas creadas'}
          </CardContent>
        </Card>
      </Grid>
      <CreateDialog
        open={openCreateDialog}
        title={'Meta'}
        handleClose={handleClickCloseCreateDialog}
        displayDropdown={renderCategoryDropdown()}
        requestMethod={saveNew}
        newObject={newObject}
        setNewObject={setNewObject}
        nameMethod={'create'}
      />
      <CreateDialog
        open={openDeleteDialog}
        title={'Meta'}
        handleClose={handleClickCloseDeleteDialog}
        requestMethod={deleteGoal}
        nameMethod={'delete'}
      />
      <CreateDialog
        open={openCreateDialog}
        title={'Meta'}
        handleClose={handleClickCloseCreateDialog}
        displayDropdown={renderCategoryDropdown()}
        requestMethod={editGoal}
        newObject={newObject}
        setNewObject={setNewObject}
        nameMethod={'edit'}
      />
    </>
  );
};

export default Goals;

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
import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import useToggle from 'hooks/useToggle';
import useCreate from 'hooks/useCreate';
import useEdit from 'hooks/useEdit';
import useDelete from 'hooks/useDelete';

const Goals = ({ goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const { userData } = useAuth();
  const [openCreateDialog, setCreateOpenDialog] = useToggle();
  const [openEditDialog, setEditOpenDialog] = useToggle();
  const [openDeleteDialog, setDeleteOpenDialog] = useToggle();
  const [goalIdSelected, setGoalSelected] = useState();
  const [categories, setCategories] = useState();
  const [newObject, setNewObject] = useState({
    description: '',
    category: null,
    author: userId,
    businessObjective: businessPlanObjective
  });
  const [create] = useCreate('/api/business-plan/goal', newObject);
  const [edit] = useEdit(`/api/business-plan/goal/${goalIdSelected}`, newObject);
  const [deletion] = useDelete(`/api/business-plan/goal/${goalIdSelected}`, newObject);

  const handleClickOpenEditDialog = (idGoal) => {
    setEditOpenDialog(true);
    const findGoal = goals.find((goal) => goal.id === idGoal);
    setNewObject({ description: findGoal.description, category: findGoal.categoryData.id });
    setGoalSelected(idGoal);
  };

  const handleClickOpenDeleteDialog = (idGoal) => {
    setGoalSelected(idGoal);
    setDeleteOpenDialog(true);
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

  const createGoal = async () => {
    create();
    setCreateOpenDialog(false);
    getBusinessObjective();
  };

  const deleteGoal = async () => {
    deletion();
    setDeleteOpenDialog(false);
    getBusinessObjective();
  };

  const editGoal = async () => {
    edit();
    setEditOpenDialog(false);
    getBusinessObjective();
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
              <IconButton aria-label="settings" onClick={setCreateOpenDialog}>
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            {goals
              ? goals.map((eachGoal, index) => {
                  const { authorData, id: idGoal } = eachGoal;
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
      <CustomDialog
        open={openCreateDialog}
        title={'Meta'}
        handleClose={setCreateOpenDialog}
        displayDropdown={renderCategoryDropdown()}
        requestMethod={createGoal}
        newObject={newObject}
        setNewObject={setNewObject}
        nameMethod={'create'}
      />
      <CustomDialog
        open={openDeleteDialog}
        title={'Meta'}
        handleClose={setDeleteOpenDialog}
        requestMethod={deleteGoal}
        nameMethod={'delete'}
      />
      <CustomDialog
        open={openEditDialog}
        title={'Meta'}
        handleClose={setEditOpenDialog}
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

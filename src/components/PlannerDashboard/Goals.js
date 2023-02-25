import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { getAxiosInstance } from 'utils/axiosClient';

import CustomAutoComplete from 'components/CustomAutoComplete';
import CustomDialog from 'components/PlannerDashboard/CustomDialog';
import CustomCardHeader from './CustomCardHeader';
import useCreate from 'hooks/useCreate';
import useDelete from 'hooks/useDelete';
import useEdit from 'hooks/useEdit';
import useMessage from 'hooks/useMessage';

const Goals = ({ goals, userId, businessPlanObjective, getBusinessObjective }) => {
  const [categories, setCategories] = useState();
  const [categoryToEdited, setCategoryToEdited] = useState();

  const [selectedGoal, setSelectedGoal] = useState({
    description: '',
    category: null,
    author: userId,
    businessObjective: businessPlanObjective
  });

  const { userData } = useAuth();
  const { handleNewMessage } = useMessage();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [create] = useCreate('/api/business-plan/goal', selectedGoal);
  const [edit] = useEdit(`/api/business-plan/goal/${selectedGoal.id}`, selectedGoal);
  const [deletion] = useDelete(`/api/business-plan/goal/${selectedGoal.id}`);

  const handleClickOpenCreateDialog = () => {
    setSelectedGoal({
      description: '',
      category: null,
      author: userId,
      businessObjective: businessPlanObjective
    });
    setOpenCreateDialog(true);
  };

  const handleClickOpenEditDialog = (goal) => {
    setCategoryToEdited(goal.categoryData);
    setSelectedGoal({
      id: goal.id,
      description: goal.description,
      category: goal.categoryData && goal.categoryData.id,
      author: userId,
      businessObjective: businessPlanObjective
    });

    setOpenEditDialog(true);
  };

  const handleClickOpenDeleteDialog = (goal) => {
    setSelectedGoal({
      id: goal.id,
      description: goal.description
    });
    setOpenDeleteDialog(true);
  };

  const getCategories = async () => {
    try {
      let response = await getAxiosInstance().get('/api/business-plan/goal/category');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      handleNewMessage({
        text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
        severity: 'error'
      });
    }
  };

  async function handleCategory(category) {
    const savedCategory = await saveNewCategory(category);

    setSelectedGoal({ ...selectedGoal, category: savedCategory ? savedCategory.id : '' });
  }

  async function saveNewCategory(category) {
    if (!category) return;
    if (!category.id) {
      try {
        const response = await getAxiosInstance().post(
          '/api/business-plan/goal/category',
          category
        );
        category.id = response.data.id;
        setCategories([...categories, category]);
      } catch (error) {
        console.error(error);
        handleNewMessage({
          text: 'Error de comunicación, por favor vuelva a intentar en unos segundos.',
          severity: 'error'
        });
        return;
      }
    }
    return category;
  }

  function hanldeCloseDialog(methodToClose) {
    setSelectedGoal({ ...selectedGoal, description: '', category: null, id: null });
    setCategoryToEdited();
    methodToClose(false);
  }

  const createGoal = async () => {
    if (selectedGoal.description == '' || selectedGoal.category < 1) {
      handleNewMessage({
        text: 'Por favor ingrese una meta valida antes de continuar.',
        severity: 'error'
      });
      return;
    }
    const error = await create();
    if (error) return;
    await getBusinessObjective();
    setOpenCreateDialog(false);
    setSelectedGoal({ ...selectedGoal, description: '', category: null, id: null });
  };

  const deleteGoal = async () => {
    const error = await deletion();
    if (error) return;
    await getBusinessObjective();
    setOpenDeleteDialog(false);
    setSelectedGoal({ ...selectedGoal, description: '', category: null, id: null });
  };

  const editGoal = async () => {
    if (selectedGoal.description == '' || selectedGoal.category < 1) {
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
    setSelectedGoal({ ...selectedGoal, description: '', category: null, id: null });
  };

  function renderCategoryDropdown() {
    return (
      <CustomAutoComplete
        name="categoryid"
        label="Categorias"
        optionList={categories}
        elmentCallback={handleCategory}
        prechargedValue={categoryToEdited}
      />
    );
  }

  const editableGoal = (goal) => {
    if (goal.authorData.id === userData.id) {
      return (
        <>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton onClick={() => handleClickOpenDeleteDialog(goal)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item justifySelf="end">
              <IconButton onClick={() => handleClickOpenEditDialog(goal)}>
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
        <Card>
          <CustomCardHeader
            title={'Metas'}
            initialLetter={'M'}
            onClickMethod={handleClickOpenCreateDialog}
            avatarColor={'warning.main'}
          />
          <CardContent>
            {goals
              ? goals.map((eachGoal, index) => {
                  return (
                    <Card key={index} sx={{ margin: 0.5 }}>
                      {eachGoal.categoryData ? (
                        <CardHeader
                          subheader={
                            <Typography variant="body1" key={index}>
                              {eachGoal.categoryData.name}
                            </Typography>
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
                        {editableGoal(eachGoal)}
                      </Grid>
                    </Card>
                  );
                })
              : 'Actualmente no hay metas creadas'}
          </CardContent>
        </Card>
      </Grid>

      <CustomDialog
        nameMethod={'create'}
        title={'Creación de nueva meta'}
        open={openCreateDialog}
        handleClose={() => hanldeCloseDialog(setOpenCreateDialog)}
        displayDropdown={renderCategoryDropdown()}
        requestMethod={createGoal}
        newObject={selectedGoal}
        setNewObject={setSelectedGoal}
      />

      <CustomDialog
        nameMethod={'delete'}
        title={'Eliminación de meta'}
        open={openDeleteDialog}
        handleClose={() => hanldeCloseDialog(setOpenDeleteDialog)}
        requestMethod={deleteGoal}
        newObject={selectedGoal}
      />

      <CustomDialog
        nameMethod={'edit'}
        title={'Edición de meta seleccionada'}
        open={openEditDialog}
        handleClose={() => hanldeCloseDialog(setOpenEditDialog)}
        displayDropdown={renderCategoryDropdown()}
        requestMethod={editGoal}
        newObject={selectedGoal}
        setNewObject={setSelectedGoal}
      />
    </>
  );
};

export default Goals;

import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  TextField
} from '@mui/material';
import CustomAutoComplete from 'components/CustomAutoComplete';
import { getAxiosInstance } from 'utils/axiosClient';
import { useState } from 'react';

const CreateDialog = ({
  open,
  title,
  handleClose,

  requiredField,
  savePath,

  categoryDropdownList,
  setCategoryDropdownListState,
  useCategories,

  useGoals,
  goalsDropdownList,

  getBusinessObjectives,
  authorid,
  businessObjectiveId
}) => {
  const [newObject, setNewObject] = useState({
    description: '',
    category: null,
    author: authorid,
    businessObjective: businessObjectiveId
  });

  async function handleCategory(goal) {
    setNewObject({ ...newObject, category: goal.id });
    if (!goal) return;
    if (!goal.id) {
      let idReturned = await saveNewItem(savePath, goal);
      goal.id = idReturned;
      setCategoryDropdownListState([...categoryDropdownList, goal]);
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

  const handleNewObjectiveDescription = (event) => {
    setNewObject({ ...newObject, description: event.target.value });
  };

  const saveNew = async () => {
    try {
      let objetiveObjectPath = savePath;
      await getAxiosInstance()
        .post(objetiveObjectPath, newObject)
        .then(() => {
          handleClose();
          getBusinessObjectives();
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
        optionList={categoryDropdownList}
        elmentCallback={handleCategory}
        requiredField={requiredField}
      />
    );
  };

  const renderGoalsDropdown = () => {
    var array = Object.keys(goalsDropdownList).map(function (key) {
      return goalsDropdownList[key];
    });

    return (
      <CustomAutoComplete
        name="categoryid"
        label="Selecciona una Meta"
        optionList={array}
        elmentCallback={handleCategory}
        requiredField={requiredField}
      />
    );
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', marginBottom: 2 }}>{title}</DialogTitle>
      <DialogContent>
        {useCategories ? renderCategoryDropdown() : ''}
        {useGoals ? renderGoalsDropdown() : ''}
        <TextField
          margin="dense"
          label="Descripcion"
          type="text"
          fullWidth
          variant="outlined"
          value={newObject.description}
          onChange={handleNewObjectiveDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={saveNew}>Crear {title}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;

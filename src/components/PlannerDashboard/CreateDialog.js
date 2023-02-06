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
  dropdownList,
  setDropdownListState,
  requiredField,
  path,
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

  async function handleGoal(goal) {
    setNewObject({ ...newObject, category: goal.id });
    if (!goal) return;
    if (!goal.id) {
      let idReturned = await saveNewItem(path, goal);
      goal.id = idReturned;
      setDropdownListState([...dropdownList, goal]);
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
      let objetiveObjectPath = path;
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

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', marginBottom: 2 }}>{title}</DialogTitle>
      <DialogContent>
        <CustomAutoComplete
          name="categoryid"
          label="Categorias"
          optionList={dropdownList}
          elmentCallback={handleGoal}
          requiredField={requiredField}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={newObject.description}
          onChange={handleNewObjectiveDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={saveNew}>Create Goal</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;

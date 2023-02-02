import {
  Dialog,
  DialogActions,
  DialogTitle,
  // DialogContentText,
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
  getList,
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
      let createdItem = await getAxiosInstance().post(paths, newItem);
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
        .then((response) => {
          console.log(response);
          getList();
        });
    } catch (error) {
      console.log('error');
    }
    handleClose;
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
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
            type="email"
            fullWidth
            variant="standard"
            value={newObject.description}
            onChange={handleNewObjectiveDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveNew}>Create Goal</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDialog;

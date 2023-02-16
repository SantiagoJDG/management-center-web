import { getAxiosInstance } from 'utils/axiosClient';

const genericHandleClickOpen = (setOpenDialog) => {
  setOpenDialog(true);
};

const genericHandleClickClose = (setOpenDialog) => {
  setOpenDialog(false);
};

const createRequestMethod = async (path, newObject, getBusinessObjective) => {
  try {
    await getAxiosInstance()
      .post(path, newObject)
      .then(() => {
        closeDialogAndResetInformation(getBusinessObjective);
      });
  } catch (error) {
    console.log('error');
  }
};

const editRequestMethod = async (path, newObject, getBusinessObjective) => {
  try {
    await getAxiosInstance()
      .put(path, newObject)
      .then(() => {
        closeDialogAndResetInformation(getBusinessObjective);
      });
  } catch (error) {
    console.log('error');
  }
};

const deleteRequestMethod = async (path, newObject, getBusinessObjective) => {
  try {
    await getAxiosInstance()
      .delete(path, newObject)
      .then(() => {
        closeDialogAndResetInformation(getBusinessObjective);
      });
  } catch (error) {
    console.log('error');
  }
};

const closeDialogAndResetInformation = (getBusinessObjective) => {
  genericHandleClickClose();
  getBusinessObjective();
};

export {
  genericHandleClickOpen,
  genericHandleClickClose,
  createRequestMethod,
  editRequestMethod,
  deleteRequestMethod
};

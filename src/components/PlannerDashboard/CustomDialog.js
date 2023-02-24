import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';

const CustomDialog = ({
  open,
  title,
  handleClose,
  displayDropdown,
  requestMethod,
  newObject,
  setNewObject,
  nameMethod
}) => {
  const handleDescription = (event) => {
    setNewObject({ ...newObject, description: event.target.value });
  };

  const deleteDialog = () => {
    return (
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'info.contrastText', marginBottom: 2 }}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Typography>{`¿Estas seguro que desea eliminar a ${newObject.description}?`}</Typography>
          <Typography></Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={requestMethod}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const createEditDialog = () => {
    return (
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'info.contrastText', marginBottom: 2 }}>
          {title}
        </DialogTitle>

        <DialogContent>
          {displayDropdown && displayDropdown}
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={newObject.description}
            onChange={handleDescription}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={requestMethod}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {nameMethod === 'create' ? createEditDialog('Crear') : ''}
      {nameMethod === 'delete' ? deleteDialog() : ''}
      {nameMethod === 'edit' ? createEditDialog('Editar') : ''}
    </>
  );
};

export default CustomDialog;

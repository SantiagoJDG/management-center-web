import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
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
        <DialogTitle sx={{ bgcolor: 'primary.main', marginBottom: 2 }}>
          Eliminar {title}
        </DialogTitle>
        <DialogContent>
          <Typography>¿Estas seguro que quieres eliminar la {title} seleccionada?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={requestMethod}>Eliminar {title}</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const createEditDialog = (method) => {
    return (
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: 'primary.main', marginBottom: 2 }}>{title}</DialogTitle>
        <DialogContent>
          {displayDropdown ? displayDropdown : ''}
          <TextField
            margin="dense"
            label="Descripcion"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleDescription}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={requestMethod}>
            {method} {title}
          </Button>
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

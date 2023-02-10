import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  TextField
} from '@mui/material';

const CreateDialog = ({
  open,
  title,
  handleClose,
  displayDropdown,
  saveNew,
  newObject,
  setNewObject
}) => {
  const handleDescription = (event) => {
    setNewObject({ ...newObject, description: event.target.value });
  };

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
        <Button onClick={saveNew}>Crear {title}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;

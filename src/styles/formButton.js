import { TextField, styled } from '@mui/material';

export const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2196f3'
    }
  }
});

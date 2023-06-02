import { TextField, styled } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';

export const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2196f3'
    }
  }
});

export const CssMuiFileInput = styled(MuiFileInput)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2196f3'
    }
  }
});

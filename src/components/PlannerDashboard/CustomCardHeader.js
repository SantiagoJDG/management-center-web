import { CardHeader, Avatar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CustomCardHeader = ({ title, initialLetter, onClickMethod, avatarColor }) => {
  return (
    <CardHeader
      sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
      avatar={
        <Avatar sx={{ bgcolor: avatarColor }} aria-label="recipe">
          {initialLetter}
        </Avatar>
      }
      title={title}
      action={
        onClickMethod ? (
          <IconButton aria-label="settings" onClick={onClickMethod}>
            <AddIcon style={{ color: 'white' }} />
          </IconButton>
        ) : (
          ''
        )
      }
    />
  );
};

export default CustomCardHeader;

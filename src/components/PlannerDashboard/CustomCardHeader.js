import { CardHeader, Avatar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CustomCardHeader = ({ title, initial, onClickMethod, avatarColor }) => {
  return (
    <CardHeader
      sx={{ bgcolor: 'primary.main' }}
      avatar={
        <Avatar sx={{ bgcolor: avatarColor }} aria-label="recipe">
          {initial}
        </Avatar>
      }
      title={title}
      action={
        <IconButton aria-label="settings" onClick={onClickMethod}>
          <AddIcon />
        </IconButton>
      }
    />
  );
};

export default CustomCardHeader;

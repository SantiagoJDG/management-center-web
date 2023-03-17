import { CardHeader, Avatar, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CustomCardHeader = ({ title, initialLetter, onClickMethod, avatarColor }) => {
  return (
    <CardHeader
      sx={{ bgcolor: '#03a9f4', color: 'info.contrastText' }}
      avatar={
        <Avatar sx={{ bgcolor: avatarColor }} aria-label="recipe">
          {initialLetter}
        </Avatar>
      }
      title={
        <Typography variant="body1" component="h2">
          {title}
        </Typography>
      }
      action={
        onClickMethod ? (
          <IconButton aria-label="settings" onClick={onClickMethod}>
            <AddCircleOutlineIcon style={{ color: 'white' }} />
          </IconButton>
        ) : (
          ''
        )
      }
    />
  );
};

export default CustomCardHeader;

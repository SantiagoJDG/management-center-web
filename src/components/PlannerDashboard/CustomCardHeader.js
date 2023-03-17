import { CardHeader, Avatar, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Typography } from '@mui/material';
const CustomCardHeader = ({ title, initialLetter, onClickMethod, avatarColor }) => {
  return (
    <CardHeader
      sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}
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
          <IconButton size="large" aria-label="settings" onClick={onClickMethod}>
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

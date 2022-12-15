import { TextField } from '@mui/material';
import React from 'react';

const CollaboratorSearch = ({ searchValue, setSearchValue }) => {
  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <TextField
      sx={{ input: { color: 'white' } }}
      id="filled-basic"
      label="Name"
      variant="filled"
      value={searchValue}
      onChange={onSearchValueChange}
    />
  );
};

export default CollaboratorSearch;

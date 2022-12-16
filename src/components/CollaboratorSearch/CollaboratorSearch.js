import { TextField } from '@mui/material';
import React from 'react';

const CollaboratorSearch = ({ searchValue, setSearchValue }) => {
  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <TextField
      id="filled-basic"
      label="Name"
      value={searchValue}
      onChange={onSearchValueChange}
    />
  );
};

export default CollaboratorSearch;

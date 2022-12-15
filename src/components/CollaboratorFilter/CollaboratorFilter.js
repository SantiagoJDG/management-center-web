import {
  Box,
  OutlinedInput,
  useTheme,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip
} from '@mui/material';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, item, theme) {
  return {
    fontWeight:
      item.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const CollaboratorFilter = ({ item, setItem, title, dropdownData }) => {
  const theme = useTheme();
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setItem(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-chip-label">{title}</InputLabel>
        <Select
          labelId="multiple-chip-label"
          multiple
          value={item}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {dropdownData.map((dropdownItem) => (
            <MenuItem
              key={dropdownItem}
              value={dropdownItem}
              style={getStyles(dropdownItem, item, theme)}
            >
              {dropdownItem}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CollaboratorFilter;

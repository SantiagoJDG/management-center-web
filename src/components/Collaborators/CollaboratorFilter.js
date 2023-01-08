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
import { useState } from 'react';

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

const CollaboratorFilter = ({ title, dropdownData, filterData, collaboratorKey }) => {
  const [item, setItem] = useState([]);
  const theme = useTheme();
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    const ternary = typeof value === 'string' ? value.split(',') : value;
    setItem(ternary);
    let id = ternary.map((selected) => {
      return selected.id;
    });
    filterData(id, collaboratorKey);
  };

  return (
    !!dropdownData && (
      <div>
        <FormControl sx={{ width: '100%' }} size="small">
          <InputLabel id="multiple-chip-label-small">{title}</InputLabel>
          <Select
            labelId="multiple-chip-label"
            multiple
            value={item}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.name} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {dropdownData.map((parameters, index) => (
              <MenuItem
                key={index}
                value={parameters}
                style={getStyles(parameters.name, item, theme)}
              >
                {parameters.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  );
};

export default CollaboratorFilter;

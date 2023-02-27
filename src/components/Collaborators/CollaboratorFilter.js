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
    console.log(value);
    const ternary = typeof value === 'string' ? value.split(',') : value;
    setItem(ternary);
    let id = ternary.map((selected) => {
      return selected.id;
    });
    filterData(id, collaboratorKey);
  };

  return (
    !!dropdownData && (
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
              {selected.map((value, index) => (
                <Chip key={index} label={value.name ? value.name : value.description} />
              ))}
            </Box>
          )}
        >
          {dropdownData.map((parameters, index) => {
            return (
              <MenuItem
                key={index}
                value={parameters}
                style={getStyles(parameters.name ? parameters.name : parameters, item, theme)}
              >
                {parameters.name ? parameters.name : parameters.description}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    )
  );
};

export default CollaboratorFilter;

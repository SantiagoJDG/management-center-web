import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme
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

const CustomFilterDropdown = ({
  title,
  dropdownData,
  filterData,
  collaboratorKey,
  selectKpiData
}) => {
  const [item, setItem] = useState(selectKpiData ? selectKpiData : []);
  const theme = useTheme();
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    const newValue = typeof value === 'string' ? value.split(',') : value;
    setItem(newValue);

    let id = newValue.map((selected) => {
      return selected.id;
    });

    filterData(id, collaboratorKey);
  };

  return (
    !!dropdownData && (
      <FormControl sx={{ width: '100%' }} size="small">
        <InputLabel id={collaboratorKey}>{title}</InputLabel>
        <Select
          id={collaboratorKey}
          multiple
          value={item}
          onChange={handleChange}
          input={<OutlinedInput id={`${collaboratorKey}-chip`} label="Chip" />}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value, index) => (
                  <Chip key={index} label={value.name ? value.name : value.description} />
                ))}
              </Box>
            );
          }}
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

export default CustomFilterDropdown;

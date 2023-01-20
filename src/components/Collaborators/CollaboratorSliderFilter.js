import * as React from 'react';
import { Box, Slider, Typography } from '@mui/material';

const CollaboratorSliderFilter = ({ setCollaborators, allCollaborators }) => {
  console.log(allCollaborators);
  const [value1, setValue1] = React.useState([0, 1000]);
  const minDistance = 1000;

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      filterBySalary() ? setCollaborators(filterBySalary()) : setCollaborators([]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      filterBySalary() ? setCollaborators(filterBySalary()) : setCollaborators([]);
    }
  };

  const filterBySalary = () => {
    return allCollaborators.filter((collaborator) => {
      if (
        collaborator.salaries[0].amount > value1[0] &&
        collaborator.salaries[0].amount < value1[1]
      ) {
        return true;
      } else {
        return false;
      }
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography>Filter by salary: </Typography>
      <Slider
        defaultValue={0}
        step={1000}
        marks
        min={0}
        max={10000}
        valueLabelDisplay="auto"
        getAriaLabel={() => minDistance}
        value={value1}
        onChange={handleChange1}
        disableSwap
      />
    </Box>
  );
};

export default CollaboratorSliderFilter;

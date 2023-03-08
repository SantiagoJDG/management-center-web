import { Box, Slider, Typography } from '@mui/material';

import { useState } from 'react';

const CollaboratorSliderFilter = ({ setCollaborators, allCollaborators }) => {
  const [salaryValues, setSalaryValues] = useState([0, 1000]);
  const minDistance = 1000;

  const handleSalaryFilter = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setSalaryValues([Math.min(newValue[0], salaryValues[1] - minDistance), salaryValues[1]]);
      filterBySalary() ? setCollaborators(filterBySalary()) : setCollaborators([]);
    } else {
      setSalaryValues([salaryValues[0], Math.max(newValue[1], salaryValues[0] + minDistance)]);
      filterBySalary() ? setCollaborators(filterBySalary()) : setCollaborators([]);
    }
  };

  const filterBySalary = () => {
    return allCollaborators.filter((collaborator) => {
      return (
        collaborator.salaries.length >= 1 &&
        collaborator.salaries[0].amount > salaryValues[0] &&
        collaborator.salaries[0].amount < salaryValues[1]
      );
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography>Filtrar por salario: </Typography>
      <Slider
        id="salaryFilter"
        name="salaryFilter"
        defaultValue={1000}
        step={100}
        marks
        min={100}
        max={50000}
        valueLabelDisplay="auto"
        getAriaLabel={() => minDistance}
        value={salaryValues}
        onChange={handleSalaryFilter}
        disableSwap
      />
    </Box>
  );
};

export default CollaboratorSliderFilter;

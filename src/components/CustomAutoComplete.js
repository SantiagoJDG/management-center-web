import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

const CustomAutoComplete = ({
  name,
  label,
  optionList,
  elmentCallback,
  multiple,
  requiredField,
  showError,
  prechargedValue
}) => {
  const [value, setValue] = useState(multiple ? [] : '');
  const [inputValue, setInputValue] = useState('');
  const filter = createFilterOptions();

  const handleSelectedOption = (newValue) => {
    if (multiple) {
      if (elmentCallback) {
        elmentCallback(newValue);
      }
      return;
    }

    let response = newValue;

    if (newValue && newValue.inputValue) {
      response = {
        name: newValue.inputValue
      };
    }
    if (elmentCallback) {
      elmentCallback(response);
    }
  };

  const getInformationView = () => {
    return (
      <Autocomplete
        id={`custom-${name}`}
        name={name}
        size="small"
        multiple={multiple}
        value={value}
        inputValue={inputValue}
        freeSolo
        selectOnFocus
        clearOnBlur
        options={optionList}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (option.name === undefined) {
            return '';
          }
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        filterOptions={(optionList, params) => {
          const filtered = filter(optionList, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = optionList.some((option) => inputValue === option.name);
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              name: `Crear nuevo "${inputValue}"`
            });
          }

          return filtered;
        }}
        onChange={(event, newValue) => {
          setValue(newValue);
          handleSelectedOption(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id ? option.id : option.name}>
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={label} required={requiredField} error={showError} />
        )}
      />
    );
  };

  useEffect(() => {
    if (prechargedValue) {
      setValue(prechargedValue);
    }
  }, [prechargedValue]);

  return getInformationView();
};

export default CustomAutoComplete;

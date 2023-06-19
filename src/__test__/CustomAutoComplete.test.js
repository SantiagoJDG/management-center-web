import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import CustomAutoComplete from 'components/CustomAutoComplete';

const testOptions = [
  { id: 1, name: 'test1' },
  { id: 2, name: 'test2' },
  { id: 3, name: 'test3' }
];

describe('CustomAutoComplete', () => {
  it('it should renders a CustomAutoComplete', () => {
    let formErrors = {};
    render(
      <CustomAutoComplete
        showError={formErrors.test}
        name="test"
        label="Testing component"
        optionList={testOptions}
        elmentCallback={jest.fn()}
        requiredField={true}
        prechargedValue={null}
      />
    );

    expect(screen.getByTestId('autocomplete-component')).toBeInTheDocument();
  });

  it('it should call callbackMethod when user write new value into CustomAutoComplete', () => {
    let formErrors = {};
    const handleTest = jest.fn();
    render(
      <CustomAutoComplete
        showError={formErrors.test}
        name="test"
        label="Testing component"
        optionList={testOptions}
        elmentCallback={handleTest}
        requiredField={true}
        prechargedValue={null}
        canCreateNew={true}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);
    fireEvent.change(combobox, { target: { value: 'new value into autocomplete' } });
    fireEvent.keyDown(combobox, { key: 'Enter' });

    expect(handleTest).toHaveBeenCalledTimes(1);
  });

  it('it should call callbackMethod when user pick up new value from array into CustomAutoComplete', async () => {
    let formErrors = {};
    const handleTest = (newValue) => {
      expect(newValue).toBe(testOptions[0]);
    };
    render(
      <CustomAutoComplete
        showError={formErrors.test}
        name="test"
        label="Testing component"
        optionList={testOptions}
        elmentCallback={handleTest}
        requiredField={true}
        prechargedValue={null}
        canCreateNew={true}
      />
    );
    const combobox = screen.getByRole('combobox');

    fireEvent.click(combobox);
    fireEvent.focus(combobox);
    fireEvent.change(combobox, { target: { value: 'test' } });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter' });
  });

  it("it should call callbackMethod with a different structure into response when the new value doesn't exist into testOptions", async () => {
    let formErrors = {};
    const handleTest = (newValue) => {
      expect(newValue).toStrictEqual({ name: "value doesn't exist" });
    };
    render(
      <CustomAutoComplete
        showError={formErrors.test}
        name="test"
        label="Testing component"
        optionList={testOptions}
        elmentCallback={handleTest}
        requiredField={true}
        prechargedValue={null}
        canCreateNew={true}
      />
    );
    const combobox = screen.getByRole('combobox');

    fireEvent.click(combobox);
    fireEvent.focus(combobox);
    fireEvent.change(combobox, { target: { value: "value doesn't exist" } });
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox, { key: 'Enter' });
  });
});

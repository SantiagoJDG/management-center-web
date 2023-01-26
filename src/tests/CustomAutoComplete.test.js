import CustomAutoComplete from 'components/CustomAutoComplete';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('CustomAutoComplete', () => {
  it('renders a CustomAutoComplete', () => {
    render(<CustomAutoComplete optionList={[]} />);
    // check if all components are rendered
    expect(screen.getByTestId('autocompleteComponent')).toBeInTheDocument();
  });
});

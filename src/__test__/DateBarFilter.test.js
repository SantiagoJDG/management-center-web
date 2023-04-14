import { render, fireEvent } from '@testing-library/react';
import DateBarFilter from '../components/Collaborators/DateBarFilter';

describe('DateBarFilter component', () => {
  it('should render the component correctly', () => {
    render(<DateBarFilter collaborators={[]} setCollaborators={() => {}} allCollaborators={[]} />);

    expect(screen.getByLabelText('Fecha de inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de cierre')).toBeInTheDocument();
  });

  it('executes setCollaborators when valid date range selected', () => {
    const collaborators = [];
    const allCollaborators = [
      { id: 1, admissionDate: '2022-01-01' },
      { id: 2, admissionDate: '2022-02-01' },
      { id: 3, admissionDate: '2022-03-01' }
    ];
    const setCollaborators = jest.fn();
    const { getByLabelText } = render(
      <DateBarFilter
        collaborators={collaborators}
        setCollaborators={setCollaborators}
        allCollaborators={allCollaborators}
      />
    );
    const initialDateInput = getByLabelText('Fecha de inicio');
    const endDateInput = getByLabelText('Fecha de cierre');
    fireEvent.change(initialDateInput, { target: { value: '02/01/2022' } });
    fireEvent.change(endDateInput, { target: { value: '03/01/2022' } });
    expect(setCollaborators).toHaveBeenCalled();
  });
});

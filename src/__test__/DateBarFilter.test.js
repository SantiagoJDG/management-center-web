import { render, fireEvent, screen } from '@testing-library/react';
import DateBarFilter from '../components/Collaborators/DateBarFilter';
import '@testing-library/jest-dom';
import moment from 'moment';

describe('DateBarFilter component', () => {
  const collaborators = [];
  const allCollaborators = [];
  const setCollaborators = jest.fn();

  it('Should render the component correctly', () => {
    render(<DateBarFilter collaborators={[]} setCollaborators={() => {}} allCollaborators={[]} />);

    expect(screen.getByLabelText('Fecha de inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de cierre')).toBeInTheDocument();
  });

  it('Should execute setCollaborators when valid date range selected', () => {
    const collaborators = [];
    const allCollaborators = [
      { id: 1, admissionDate: '2022-01-01' },
      { id: 2, admissionDate: '2022-02-01' },
      { id: 3, admissionDate: '2022-03-01' }
    ];
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

  it('Should displays error when initialDate is greater than endDate', () => {
    render(
      <DateBarFilter
        collaborators={collaborators}
        setCollaborators={setCollaborators}
        allCollaborators={allCollaborators}
      />
    );
    const initialDateInput = screen.getByLabelText('Fecha de inicio');
    const endDateInput = screen.getByLabelText('Fecha de cierre');

    const initialDate = moment().format('MM/DD/YYYY');
    const endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');

    fireEvent.change(initialDateInput, { target: { value: initialDate } });
    fireEvent.change(endDateInput, { target: { value: endDate } });

    const errorText = screen.getByText('No puede ser mayor a Fecha de cierre');
    expect(errorText).toBeInTheDocument();
  });

  it('Should displays error when endDate is before initialDate', () => {
    render(
      <DateBarFilter
        collaborators={collaborators}
        setCollaborators={setCollaborators}
        allCollaborators={allCollaborators}
      />
    );
    const initialDateInput = screen.getByLabelText('Fecha de inicio');
    const endDateInput = screen.getByLabelText('Fecha de cierre');

    const initialDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
    const endDate = moment().format('MM/DD/YYYY');

    fireEvent.change(initialDateInput, { target: { value: endDate } });
    fireEvent.change(endDateInput, { target: { value: initialDate } });

    const errorText = screen.getByText('No puede ser menor a Fecha de inicio');
    expect(errorText).toBeInTheDocument();
  });
});

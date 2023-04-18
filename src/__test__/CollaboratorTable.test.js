import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';

import '@testing-library/jest-dom/extend-expect';
import CollaboratorTable from '../components/Collaborators/CollaboratorTable';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
const pushMock = jest.fn().mockImplementation(() => {});

describe('CollaboratorTable', () => {
  const collaborators = [
    {
      id: 1,
      name: 'Santiago Davila',
      admissionDate: '2020-01-01',
      residencyData: { countryData: { name: 'Argentina' } },
      officeData: { name: 'Panama' },
      salaries: [{ amount: 5000 }],
      supervisorData: { name: 'Elon Musk' },
      profiles: [
        {
          id: 1,
          name: 'Profile 1'
        },
        {
          id: 2,
          name: 'Profile 2'
        }
      ]
    },
    {
      id: 2,
      name: 'Edgar Guevara',
      admissionDate: '2019-01-01',
      residencyData: { countryData: { name: 'Panama' } },
      officeData: { name: 'Republica Dominicana' },
      salaries: [{ amount: 6000 }],
      supervisorData: { name: 'Zuckerbeg' },
      profiles: [
        {
          id: 1,
          name: 'Profile 1'
        },
        {
          id: 2,
          name: 'Profile 2'
        }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the table with correct columns', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock
    });
    render(<CollaboratorTable collaborators={collaborators} />);

    expect(screen.getByText('Nombre y apellidos')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Ingreso')).toBeInTheDocument();
    expect(screen.getByText('País de Residencia')).toBeInTheDocument();
    expect(screen.getByText('País de Contrato')).toBeInTheDocument();
    expect(screen.getByText('Tarifa mensual bruta')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
  });

  it('Should sorts the table information when the header of a column is clicked', () => {
    const { getByText, getAllByRole } = render(<CollaboratorTable collaborators={collaborators} />);

    const nameHeader = getByText('Nombre y apellidos');
    expect(nameHeader).toBeInTheDocument();

    fireEvent.click(nameHeader);

    const rows = getAllByRole('checkbox');

    const firstRow = rows[0];
    expect(firstRow).toHaveTextContent('Edgar Guevara');
  });

  it('Should render call push method inside useRouter when click "Ver Perfil"', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock
    });
    const { getByText } = render(<CollaboratorTable collaborators={collaborators} />);
    const row = getByText('Santiago Davila');
    fireEvent.click(row);
    const submenu = getByText('Ver Perfil');
    fireEvent.click(submenu);
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('Should render call push method inside useRouter when click "Editar"', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock
    });
    const { getByText } = render(<CollaboratorTable collaborators={collaborators} />);
    const row = getByText('Santiago Davila');
    fireEvent.click(row);
    const submenu = getByText('Editar');
    fireEvent.click(submenu);
    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});

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
      name: 'Edgar Alexander',
      lastName: 'Guevara Naranjo',
      birthdate: '1991-05-17',
      personalEmail: 'edgarguevara33@gmail.com',
      businessCode: 'CT001',
      admissionDate: '2015-07-15',
      businessEmail: 'eguevara@consultec-ti.com',
      photoAddress: '',
      status: {
        id: 1,
        name: 'ACTIVO',
        description: 'recurso se encuentra 100% activo.'
      },
      residencies: [
        {
          id: 1,
          address: 'Calle 1 PH bahia 1 apto 1',
          country: {
            id: 1,
            name: 'Panamá'
          },
          city: {
            id: 1,
            name: 'Ciudad de Panamá'
          },
          status: {
            id: 1,
            name: 'ACTIVO',
            description: 'recurso se encuentra 100% activo.'
          }
        }
      ],
      contracts: [
        {
          baseAmount: 1,
          office: {
            id: 1,
            name: 'Panamá',
            description: 'Oficina ubicada en ciudad de Panamá',
            countryId: 1
          },
          company: {
            id: 1,
            name: 'Consultec-Ti',
            description:
              'Consultec-Ti empresa formada desde hace mas de 10 años de software factory'
          },
          contractValidity: null,
          currency: {
            id: 1,
            name: 'USD',
            description: '',
            amountToDollar: 1
          },
          status: {
            id: 1,
            name: 'ACTIVO',
            description: 'recurso se encuentra 100% activo.'
          },
          contractType: {
            id: 1,
            name: 'Honorarios profesionales',
            description:
              'Contratacion basada en pago por honorarios profesionales y sin beneficios de ley.'
          }
        }
      ],
      consultecIdentity: [
        {
          id: 1,
          seniorityId: 1,
          readinessId: 1,
          sessionDate: '2022-02-15',
          nextSessionDate: '2023-02-15',
          supervisorId: 2,
          collaboratorId: 1,
          docAddress: 'https://www.africau.edu/images/default/sample.pdf',
          seniority: {
            id: 1,
            name: 'Pasante',
            description: 'Consultec way'
          },
          readiness: {
            id: 1,
            name: '1',
            description: 'Inicio de capacidad'
          }
        }
      ],
      organizational_structure: {
        id: 1,
        departmentId: 1,
        supervisorId: 2,
        collaboratorId: 1,
        org_profiles: [
          {
            id: 1,
            name: 'Desarrollador',
            org_str_prof: {
              id: 1,
              org_structur: 1,
              org_profile_: 1
            }
          }
        ],
        supervisorData: {
          id: 2,
          name: 'Santiago',
          lastName: 'Davila'
        }
      }
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
    expect(firstRow).toHaveTextContent('Edgar Alexander Guevara Naranjo');
  });

  it('Should render call push method inside useRouter when click "Ver Perfil"', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock
    });

    const { getByText } = render(<CollaboratorTable collaborators={collaborators} />);

    const row = getByText('Edgar Alexander Guevara Naranjo');
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

    const row = getByText('Edgar Alexander Guevara Naranjo');
    fireEvent.click(row);

    const submenu = getByText('Editar');
    fireEvent.click(submenu);

    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import '@testing-library/jest-dom';
import UserInfo from '../components/User/UserInfo';
import { render } from '@testing-library/react';

describe('UserInfo component', () => {
  const userData = {
    name: 'Santiago Davila',
    admissionDate: '2022-02-01T00:00:00.000Z',
    supervisorData: {
      name: 'Edgar Guevara'
    },
    clientData: {
      name: 'Consultec'
    },
    profiles: [
      { name: 'Profile 1' },
      { name: 'Profile 2' },
      { name: 'Profile 3' },
      { name: 'Profile 4' },
      { name: 'Profile 5' },
      { name: 'Profile 6' },
      { name: 'Profile 7' },
      { name: 'Profile 8' },
      { name: 'Profile 9' },
      { name: 'Profile 10' }
    ],
    knowledges: [
      { name: 'Knowledge 1' },
      { name: 'Knowledge 2' },
      { name: 'Knowledge 3' },
      { name: 'Knowledge 4' },
      { name: 'Knowledge 5' },
      { name: 'Knowledge 6' },
      { name: 'Knowledge 7' },
      { name: 'Knowledge 8' },
      { name: 'Knowledge 9' },
      { name: 'Knowledge 10' }
    ],
    technologies: [
      { name: 'Technology 1' },
      { name: 'Technology 2' },
      { name: 'Technology 3' },
      { name: 'Technology 4' },
      { name: 'Technology 5' },
      { name: 'Technology 6' },
      { name: 'Technology 7' },
      { name: 'Technology 8' },
      { name: 'Technology 9' },
      { name: 'Technology 10' }
    ]
  };

  it('Should render component correctly', () => {
    const { getByTestId } = render(<UserInfo userDataLogged={userData} />);
    expect(getByTestId('user-info-component')).toBeInTheDocument();
  });

  it('Should render user data correctly', () => {
    const { getByText } = render(<UserInfo userDataLogged={userData} />);
    expect(getByText('Santiago Davila')).toBeInTheDocument();
    expect(getByText('Fecha de ingreso')).toBeInTheDocument();
    expect(getByText('Supervisor')).toBeInTheDocument();
    expect(getByText('Cliente')).toBeInTheDocument();
  });

  it('Should limit the N-1 Perfil to 8 items', () => {
    const { getAllByText } = render(<UserInfo userDataLogged={userData} />);
    const perfilItems = getAllByText(/Profile \d/);
    expect(perfilItems.length).toBe(8);
  });

  it('Should limit the N-2 Conocimientos to 8 items', () => {
    const { getAllByText } = render(<UserInfo userDataLogged={userData} />);
    const perfilItems = getAllByText(/Knowledge \d/);
    expect(perfilItems.length).toBe(8);
  });

  it('Should limit the N-3 Tecnologias to 8 items', () => {
    const { getAllByText } = render(<UserInfo userDataLogged={userData} />);
    const perfilItems = getAllByText(/Technology \d/);
    expect(perfilItems.length).toBe(8);
  });
});

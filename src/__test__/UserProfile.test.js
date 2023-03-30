import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import UserProfile from '../components/User/UserProfile';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
const pushMock = jest.fn().mockImplementation(() => {});

describe('UserProfile component', () => {
  const userDataLogged = {
    admissionDate: '2022-11-15',
    clientData: { id: 3, name: 'Banco General', description: null },
    email: 'sdavila@consultec-ti.com',
    id: 2,
    internalCode: 'CT002',
    internalRoles: [
      { id: 1, name: 'Administrador', collaborator_role: {} },
      { id: 2, name: 'Usuario', collaborator_role: {} }
    ],
    knowledges: [],
    name: 'Santiago Davila',
    picture:
      'https://lh3.googleusercontent.com/a/AGNmyxYW7zKsZes0d-yO4AlfbDovbFSuQJyXDgtIQ-E-=s96-c',
    profiles: [
      { id: 6, name: 'Gestión Operativa', collaborator_profile: {} },
      { id: 4, name: 'Infraestructura', collaborator_profile: {} }
    ],
    supervisorData: {
      admissionDate: '2015-07-15',
      client: 3,
      company: 1,
      contractType: 1,
      email: 'eguevara@consultec-ti.com',
      emailSignature: 'Project & Technical Leader',
      id: 1,
      identification: '137753686',
      identificationType: 3,
      identityRole: 1,
      internalCode: 'CT001',
      management: 1,
      name: 'Edgar Alexander Guevara Naranjo',
      office: 1,
      readiness: 2,
      residency: 1,
      seniority: 6,
      status: 1,
      supervisor: 1,
      technologies: []
    }
  };

  it('Renders component correctly', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
      pathname: '/user-profile'
    });
    render(<UserProfile userDataLogged={userDataLogged} />);
    const headingElement = screen.getByText('Quiero ingresar como');
    expect(headingElement).toBeInTheDocument();
  });

  it('Checks if userDataLogged has at least one role item', () => {
    render(<UserProfile userDataLogged={userDataLogged} />);
    const roleElements = screen.getAllByRole('button');
    expect(roleElements.length).toBeGreaterThanOrEqual(1);
  });

  it('checks if storeUserRoleProfile reroutes to /', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
      pathname: '/'
    });
    render(<UserProfile userDataLogged={userDataLogged} />);
    const roleElements = screen.getAllByRole('button');
    fireEvent.click(roleElements[0]);
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});

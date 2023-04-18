import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CollaboratorInformation from '../components/Collaborators/CollaboratorInformation';

const mockCollaboratorData = {
  admissionDate: '2021-01-01',
  internalCode: '0001',
  name: 'Santiago Davila',
  emailSignature: 'santiagodavila@consultec-it.com',
  email: 'santiagodavila@gmail.com',
  residencyData: {
    countryData: { name: 'Argentina' },
    stateData: { name: 'Buenos Aires' }
  },
  supervisorData: { name: 'Edgar Guevara' },
  companyData: { name: 'Consultec' },
  officeData: { name: 'Panama' },
  statusData: { name: 'ACTIVE' },
  contractTypeData: { name: 'Full-time' },
  salaries: [{ amount: 5000 }],
  managementData: { name: 'Operations' },
  clientData: { name: 'XYZ Client' },
  profiles: [
    { id: 1, name: 'Profile 1' },
    { id: 2, name: 'Profile 2' }
  ],
  knowledges: [
    { id: 1, name: 'Knowledge 1' },
    { id: 2, name: 'Knowledge 2' }
  ],
  technologies: [
    { id: 1, name: 'Technology 1' },
    { id: 2, name: 'Technology 2' }
  ],
  identityRoleData: { name: 'Role 1' },
  seniorityData: { name: 'Senior' },
  readinessData: { name: 'Ready' },
  internalRoles: [
    { id: 1, name: 'Role 1' },
    { id: 2, name: 'Role 2' }
  ]
};
describe('CollaboratorInformation component', () => {
  it('should render the collaborator information', () => {
    render(<CollaboratorInformation collaboratorData={mockCollaboratorData} />);

    expect(screen.getByText('Santiago Davila')).toBeInTheDocument();
    expect(screen.getByText('santiagodavila@consultec-it.com')).toBeInTheDocument();
    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    expect(screen.getByText('Edgar Guevara')).toBeInTheDocument();
    expect(screen.getByText('Consultec')).toBeInTheDocument();
    expect(screen.getByText('Panama')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });
});

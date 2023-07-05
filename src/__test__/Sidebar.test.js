import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useAuth from 'hooks/useAuth';
import Sidebar from '../components/Layout/Sidebar';

jest.mock('hooks/useAuth');

const mockedUserData = {
  name: 'Testing Name',
  admissionDate: '2022-01-01',
  supervisorData: { name: 'Testing supervisor' },
  clientData: { name: 'Consultec' },
  profiles: [{ name: 'Profile 1' }, { name: 'Profile 2' }],
  knowledges: [{ name: 'Knowledge 1' }, { name: 'Knowledge 2' }],
  technologies: [{ name: 'Technology 1' }, { name: 'Technology 2' }]
};

describe('Sidebar', () => {
  beforeAll(() => {
    useAuth.mockReturnValue({ userData: mockedUserData });
  });

  it('renders Sidebar metadata', () => {
    render(<Sidebar />);
    const sidebarMetadata = screen.getByTestId('sidebar');
    expect(sidebarMetadata).toBeInTheDocument();
  });
});

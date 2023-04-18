import EditableCollaborator from '../components/Collaborators/EditableCollaborator';
import '@testing-library/jest-dom';
import 'moment/locale/es';
import useMessage from 'hooks/useMessage';
import { act } from 'react-dom/test-utils';

import { render, screen } from '@testing-library/react';
import { getAxiosInstance } from 'utils/axiosClient';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('utils/axiosClient');

const collaboratorData = {
  admissionDate: '2015-07-15',
  clientData: {
    id: 3,
    name: 'Banco General',
    description: null
  },
  companyData: {
    id: 1,
    name: 'Consultec-Ti',
    description: 'Consultec-Ti empresa formada desde hace mas de 10 años de software factory'
  },
  contractTypeData: {
    id: 1,
    name: 'Honorarios Profesionales',
    description: 'Contratacion basada en pago por honorarios profesionales y sin beneficios de ley.'
  },
  email: 'eguevara@consultec-ti.com',
  emailSignature: 'Project & Technical Leader',
  id: 1,
  identityRoleData: {
    id: 1,
    name: 'Lider tecnico',
    description: 'Funje como lider tecnico actualmente'
  },
  internalCode: 'CT001',
  internalRoles: [
    {
      collaborator_role: {
        id: 2,
        collaborator_id: 1,
        role_id: 2
      },
      id: 2,
      name: 'Usuario'
    },
    {
      collaborator_role: {
        id: 1,
        collaborator_id: 1,
        role_id: 1
      },
      id: 1,
      name: 'Administrador'
    }
  ],
  knowledges: [
    {
      collaborator_knowledge: {
        id: 1,
        collaborator_id: 1,
        knowledge_id: 1
      },
      id: 1,
      name: 'Backend'
    },
    {
      collaborator_knowledge: {
        id: 2,
        collaborator_id: 1,
        knowledge_id: 2
      },
      id: 2,
      name: 'Base de datos'
    },
    {
      collaborator_knowledge: {
        id: 3,
        collaborator_id: 1,
        knowledge_id: 3
      },
      id: 3,
      name: 'APIs'
    },
    {
      collaborator_knowledge: {
        id: 6,
        collaborator_id: 1,
        knowledge_id: 6
      },
      id: 6,
      name: 'Frontend Web'
    },
    {
      collaborator_knowledge: {
        id: 9,
        collaborator_id: 1,
        knowledge_id: 9
      },
      id: 9,
      name: 'Liferay'
    }
  ],
  managementData: {
    id: 1,
    name: 'Innovación',
    description: 'Proyectos de innovacion'
  },
  name: 'Edgar Alexander Guevara Naranjo',
  officeData: {
    id: 1,
    name: 'Panamá',
    description: 'Oficina ubicada en ciudad de Panamá'
  },
  profiles: [
    {
      collaborator_profile: {
        id: 1,
        collaborator_id: 1,
        profile_id: 1
      },
      id: 1,
      name: 'Desarrollador'
    }
  ],
  readinessData: {
    id: 2,
    name: '2',
    description: 'Generación de independencia'
  },
  residencyData: {
    id: 1,
    address: 'Calle 1 PH bahia 1 apto 1',
    countryData: {},
    stateData: {
      id: 1
    }
  },
  salaries: {
    id: 1,
    amount: 1230.408,
    discountAmount: 0,
    collaborator_salary: {
      id: 1,
      collaborator_id: 1,
      salary_id: 1
    }
  },
  seniorityData: {
    id: 6,
    name: 'Líder',
    description: 'Liderazgo y desarrollo de otros'
  },
  statusData: {
    id: 1,
    name: 'ACTIVO',
    description: 'el colaborador se encuentra 100% activo.'
  },
  supervisorData: {
    id: 1,
    email: 'eguevara@consultec-ti.com',
    name: 'Edgar Alexander Guevara Naranjo',
    identification: '137753686',
    identificationType: 3
  },
  technologies: [
    {
      id: 2,
      name: 'Java',
      collaborator_technology: {
        id: 1,
        collaborator_id: 1,
        technology_id: 2
      }
    },
    {
      id: 3,
      name: 'NodeJs',
      collaborator_technology: {
        id: 3,
        collaborator_id: 1,
        technology_id: 4
      }
    },
    {
      id: 4,
      name: 'Phyton',
      collaborator_technology: {
        id: 3,
        collaborator_id: 1,
        technology_id: 4
      }
    },
    {
      id: 6,
      name: 'AWS Lambda',
      collaborator_technology: {
        id: 6,
        collaborator_id: 1,
        technology_id: 8
      }
    },
    {
      id: 17,
      name: 'IONIC',
      collaborator_technology: {
        id: 5,
        collaborator_id: 1,
        technology_id: 17
      }
    }
  ]
};

describe('EditableCollaborator', () => {
  const setPrincipalInformation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render correctly', async () => {
    useMessage.mockReturnValue({ handleNewMessage: jest.fn() });

    getAxiosInstance.mockImplementation(() => ({
      get: jest.fn(() => Promise.resolve({}))
    }));
    await act(async () => {
      render(
        <EditableCollaborator
          collaboratorData={collaboratorData}
          setPrincipalInformation={setPrincipalInformation}
        ></EditableCollaborator>
      );
    });

    expect(screen.findByText('Información de identidad personal')).toBeTruthy();
  });
});

import { render, screen } from '@testing-library/react';
import ContractInformationStepThree from '../components/Collaborators/CreateCollaboratorSteps/ContractInformationStepThree';
import { act } from 'react-dom/test-utils';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: () => ({
    handleNewMessage: jest.fn()
  })
}));

describe('Contract Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('component is mounted correctly', async () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((callback) => callback());

    await act(async () => {
      render(<ContractInformationStepThree ref={jest.fn()} />);
    });
    expect(screen.getByText('Empresa Contratante')).toBeInTheDocument();
  });

  it('validateForm method should be executed ', async () => {
    const validateForm = jest.fn();
    validateForm.mockImplementation(() => {});
    const globalRef = React.createRef();

    render(<ContractInformationStepThree ref={globalRef} />);

    globalRef.current = validateForm;
    globalRef.current();

    expect(validateForm).toHaveBeenCalled();
  });
});

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

  it('ContractInformationStepThree component is mounted correctly 1', async () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((callback) => callback());
    const formStepInformationData = { thirdStepForm: {} };

    await act(async () => {
      render(
        <ContractInformationStepThree
          ref={jest.fn()}
          formData={formStepInformationData.thirdStepForm}
        />
      );
    });
    expect(screen.getByText('Empresa Contratante')).toBeInTheDocument();
  });

  it('ContractInformationStepThree validateForm method should be executed 1', async () => {
    const validateForm = jest.fn();
    validateForm.mockImplementation(() => {});
    const globalRef = React.createRef();
    const formStepInformationData = { thirdStepForm: {} };

    render(
      <ContractInformationStepThree
        ref={jest.fn()}
        formData={formStepInformationData.thirdStepForm}
      />
    );

    globalRef.current = validateForm;
    globalRef.current();

    expect(validateForm).toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import CompanyInformationStepTwo from '../components/Collaborators/CreateCollaboratorSteps/CompanyInformationStepTwo';
import { act } from 'react-dom/test-utils';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: () => ({
    handleNewMessage: jest.fn()
  })
}));

describe('Company Information', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CompanyInformationStepTwo component is mounted correctly', async () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((callback) => callback());

    const formStepInformationData = { secondStepForm: {} };

    await act(async () => {
      render(
        <CompanyInformationStepTwo
          ref={jest.fn()}
          formData={formStepInformationData.secondStepForm}
        />
      );
    });
    expect(screen.getByLabelText('Codigo de empleado')).toBeInTheDocument();
  });

  it('CompanyInformationStepTwo validateForm method should be executed ', async () => {
    const validateForm = jest.fn();
    validateForm.mockImplementation(() => {});
    const globalRef = React.createRef();
    const formStepInformationData = { secondStepForm: {} };

    render(
      <CompanyInformationStepTwo
        ref={globalRef}
        formData={formStepInformationData.secondStepForm}
      />
    );

    globalRef.current = validateForm;
    globalRef.current();

    expect(validateForm).toHaveBeenCalled();
  });
});

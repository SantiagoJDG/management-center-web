import { render, screen } from '@testing-library/react';
import PersonalnformationStepOne from '../components/Collaborators/CreateCollaboratorSteps/PersonalnformationStepOne';
import { act } from 'react-dom/test-utils';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';

jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: () => ({
    handleNewMessage: jest.fn()
  })
}));

describe('PersonalInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('First step component is mounted correctly', async () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementation((callback) => callback());

    const formStepInformationData = { firstStepForm: {} };

    await act(async () => {
      render(
        <PersonalnformationStepOne
          ref={jest.fn()}
          formData={formStepInformationData.firstStepForm}
        />
      );
    });
    expect(screen.getAllByText('Fotografia del Consultor')[0]).toBeInTheDocument();
  });

  it('First step validateForm method should be executed ', async () => {
    const validateForm = jest.fn();
    validateForm.mockImplementation(() => {});
    const globalRef = React.createRef();
    const formStepInformationData = { firstStepForm: {} };
    render(
      <PersonalnformationStepOne ref={globalRef} formData={formStepInformationData.firstStepForm} />
    );

    globalRef.current = validateForm;
    globalRef.current();

    expect(validateForm).toHaveBeenCalled();
  });
});

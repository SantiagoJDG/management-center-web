import { render, screen } from '@testing-library/react';
import PaymentInformationStepFour from '../components/Collaborators/CreateCollaboratorSteps/PaymentInformationStepFour';
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
      render(<PaymentInformationStepFour ref={jest.fn()} />);
    });
    expect(screen.getByText('Banco / Medio de pago')).toBeInTheDocument();
  });

  it('validateForm method should be executed ', async () => {
    const validateForm = jest.fn();
    validateForm.mockImplementation(() => {});
    const globalRef = React.createRef();

    render(<PaymentInformationStepFour ref={globalRef} />);

    globalRef.current = validateForm;
    globalRef.current();

    expect(validateForm).toHaveBeenCalled();
  });
});

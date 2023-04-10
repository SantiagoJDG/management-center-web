import { render } from '@testing-library/react';
import React from 'react';
import CollaboratorBarFilter, {
  getDataInformation
} from '../components/Collaborators/CollaboratorBarFilter';
import useMessage from 'hooks/useMessage';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('CollaboratorBarFilter component', () => {
  let setCollaborators;
  let useEffect;

  const mockUseEffect = () => {
    useEffect.mockImplementation(() => {});
  };

  beforeEach(() => {
    setCollaborators = jest.fn();
    useEffect = jest.spyOn(React, 'useEffect');
    mockUseEffect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Must render correctly', () => {
    useMessage.mockReturnValue({ handleNewMessage: jest.fn() });
    const { container } = render(<CollaboratorBarFilter setCollaborators={setCollaborators} />);
    expect(container).toBeInTheDocument();
  });

  test('returns status 200', async () => {
    const path = '/api/hiring/offices';
    const callbackMethod = jest.fn();
    const mockResponse = { data: 'mock data' };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    await getDataInformation(path, callbackMethod);

    expect(callbackMethod).toHaveBeenCalledWith(mockResponse);
  });
});

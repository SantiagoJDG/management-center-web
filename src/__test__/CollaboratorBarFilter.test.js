import { render, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';

import { act } from 'react-dom/test-utils';
import { getAxiosInstance } from 'utils/axiosClient';

import CollaboratorBarFilter from '../components/Collaborators/CollaboratorBarFilter';
import useMessage from 'hooks/useMessage';
import '@testing-library/jest-dom';

jest.mock('utils/axiosClient');

jest.mock('hooks/useMessage', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('CollaboratorBarFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData = [
    { id: 1, name: 'Venezuela' },
    { id: 2, name: 'Argentina' }
  ];

  it('Should fetch filter data', async () => {
    useMessage.mockReturnValue({ handleNewMessage: jest.fn() });

    getAxiosInstance.mockImplementation(() => ({
      get: jest.fn(() => Promise.resolve({ data: mockData }))
    }));

    await act(async () => {
      render(<CollaboratorBarFilter setCollaborators={() => {}} />);
    });

    expect(getAxiosInstance).toHaveBeenCalledTimes(8);
  });

  it('Should handle error when fetching filter data', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    getAxiosInstance.mockImplementation(() => ({
      get: jest.fn(() => Promise.reject({}))
    }));

    await act(async () => {
      render(<CollaboratorBarFilter setCollaborators={() => {}} />);
    });

    expect(consoleSpy).toBeTruthy();
  });

  it('Should fill the Dropdown list information', async () => {
    useMessage.mockReturnValue({ handleNewMessage: jest.fn() });

    getAxiosInstance.mockImplementation(() => ({
      get: jest.fn(() => Promise.resolve({ data: mockData }))
    }));

    await act(async () => {
      render(<CollaboratorBarFilter setCollaborators={() => {}} />);
    });

    fireEvent.mouseDown(screen.getAllByRole('button')[0]);
    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getByText(/Argentina/i)).toBeTruthy();
  });

  it('Should execute getAxiosInstance on click an Element in the dropdown', async () => {
    useMessage.mockReturnValue({ handleNewMessage: jest.fn() });
    const mockSetCollaborators = jest.fn();
    getAxiosInstance.mockImplementation(() => ({
      get: jest.fn(() => Promise.resolve({ data: mockData }))
    }));

    await act(async () => {
      render(<CollaboratorBarFilter setCollaborators={mockSetCollaborators} />);
    });

    fireEvent.mouseDown(screen.getAllByRole('button')[0]);
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Argentina/i));

    expect(getAxiosInstance).toHaveBeenCalledTimes(9);
  });
});

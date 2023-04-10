import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import CollaboratorBarFilter from '../components/Collaborators/CollaboratorBarFilter';
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

  test('executeFilter is called when an item is selected from a dropdown', () => {
    const executeFilter = jest.fn();
    const { getAllByRole, getByRole } = render(
      <CollaboratorBarFilter setCollaborators={setCollaborators} />
    );
    const listbox = getAllByRole('button');
    fireEvent.mouseDown(listbox[0]);
    const listbox2 = within(getByRole('listbox'));
    fireEvent.click(listbox2);
    expect(executeFilter).toHaveBeenCalled();
  });
});

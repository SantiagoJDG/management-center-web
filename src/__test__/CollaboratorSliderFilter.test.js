import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CollaboratorSliderFilter from '../components/Collaborators/CollaboratorSliderFilter';

describe('CollaboratorSliderFilter', () => {
  it('Should render the component correctly', () => {
    const { container } = render(
      <CollaboratorSliderFilter setCollaborators={() => {}} allCollaborators={[]} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should calls setCollaborators when user interacts with slider', () => {
    const mockSetCollaborators = jest.fn();
    const { getAllByRole } = render(
      <CollaboratorSliderFilter setCollaborators={mockSetCollaborators} allCollaborators={[]} />
    );
    const slider = getAllByRole('slider');
    fireEvent.change(slider[0], { target: { value: [1000, 2000] } });
    expect(mockSetCollaborators).toHaveBeenCalled();
  });
});

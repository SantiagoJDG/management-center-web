import React from 'react';
import { useRouter } from 'next/router';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BreadCrumb from '../components/Layout/Breadcrumb';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
const pushMock = jest.fn().mockImplementation(() => {});
const backMock = jest.fn();

describe('BreadCrumb', () => {
  it('Mount Bread Crumbcomponent correctly', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
      back: backMock,
      pathname: '/planner'
    });

    render(<BreadCrumb />);
    const mainMenuLink = screen.getByText('Menú principal');
    expect(mainMenuLink).toBeInTheDocument();
  });

  it('Displays correct breadcrumb links', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
      back: backMock,
      pathname: '/planner'
    });

    render(<BreadCrumb />);
    expect(screen.getByText('Planificacion Estratégica'));
  });

  it('Return to its previous path', () => {
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
      back: backMock,
      pathname: '/planner'
    });

    render(<BreadCrumb />);
    const goBackButton = screen.getByTestId('goBack-button');
    fireEvent.click(goBackButton);
    expect(backMock).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/common/Header';

describe('Header', () => {
  it('renders site name, page name and buttons', () => {
    render(<Header siteName="MySite" pageName="Dashboard" />);

    expect(screen.getByText('MySite')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Botao 1/i)).toBeInTheDocument();
    expect(screen.getByText(/botao 2/i)).toBeInTheDocument();
  });
});

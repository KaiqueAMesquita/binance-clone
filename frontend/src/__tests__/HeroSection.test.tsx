import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/common/HeroSection';

describe('HeroSection', () => {
  it('renders hero title and stats', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Seja bem vindo a Binance/i)).toBeInTheDocument();
    expect(screen.getByText(/271,299,832/)).toBeInTheDocument();
    expect(screen.getByText(/USUÁRIOS CONFIAM EM NÓS/i)).toBeInTheDocument();
  });
});

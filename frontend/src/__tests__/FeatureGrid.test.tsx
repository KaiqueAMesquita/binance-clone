import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureGrid from '@/components/common/FeatureGrid';

describe('FeatureGrid', () => {
  it('renders feature titles', () => {
    render(<FeatureGrid />);
    expect(screen.getByText(/Segurança/i)).toBeInTheDocument();
    expect(screen.getByText(/Alta Velocidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Análises/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile/i)).toBeInTheDocument();
  });
});

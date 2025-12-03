import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetTable, { AssetRow } from '@/app/wallet/components/AssetTable';

const sampleAssets: AssetRow[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.12345678,
    fiatValue: 5000,
    fiatCurrency: 'USD',
    costBasis: 4000,
    currentPrice: 45000,
    pnlToday: 50,
    pnlIsPositive: true,
    accent: '#f7931a',
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    quantity: 10,
    fiatValue: 0.5,
    fiatCurrency: 'USD',
    costBasis: 0.4,
    currentPrice: 0.05,
    pnlToday: -0.01,
    pnlIsPositive: false,
    accent: '#c2a633',
  },
];

describe('AssetTable', () => {
  it('renders assets and can hide small assets', () => {
    render(<AssetTable assets={sampleAssets} />);

    // Both assets present initially
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Dogecoin')).toBeInTheDocument();

    // Click the hide small assets checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Dogecoin has fiatValue 0.5 and should be hidden
    expect(screen.queryByText('Dogecoin')).not.toBeInTheDocument();
    // Bitcoin remains
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('toggles tabs', () => {
    render(<AssetTable assets={sampleAssets} />);
    const tabCoin = screen.getByRole('tab', { name: /Visualização de Moeda/i });
    const tabAccount = screen.getByRole('tab', { name: /Visualizar Conta/i });
    expect(tabCoin).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(tabAccount);
    expect(tabAccount).toHaveAttribute('aria-selected', 'true');
  });
});

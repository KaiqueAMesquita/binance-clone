import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletSummary from '@/app/wallet/components/WalletSummary';

const mockData = {
  estimatedBalanceBtc: 0.00123456,
  estimatedCurrency: 'BTC',
  estimatedBalanceFiat: 123.45,
  fiatSymbol: 'USD',
  pnlToday: { value: 5.2, percentage: 4.23, currency: 'USD', isPositive: true },
};

describe('WalletSummary (smoke)', () => {
  it('renders summary when component exists', () => {
    render(<WalletSummary data={mockData} /> as any);
    expect(screen.getByText(/Saldo Estimado/i)).toBeInTheDocument();
  });
});

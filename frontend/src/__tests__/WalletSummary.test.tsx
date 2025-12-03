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

describe('WalletSummary', () => {
  it('renders balance, fiat and pnl info', () => {
    render(<WalletSummary data={mockData} />);
    expect(screen.getByText(/Saldo Estimado/i)).toBeInTheDocument();
    // check formatted fiat and currency
    expect(screen.getByText(/123,45/)).toBeInTheDocument();
    expect(screen.getAllByText(/USD/)[0]).toBeInTheDocument();
    expect(screen.getByText(/PNL de Hoje/i)).toBeInTheDocument();
    // Chart labels (week days)
    expect(screen.getByText(/SEG/)).toBeInTheDocument();
    expect(screen.getByText(/DOM/)).toBeInTheDocument();
  });
});

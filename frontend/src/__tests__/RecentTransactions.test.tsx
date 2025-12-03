import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentTransactions from '@/app/wallet/components/RecentTransactions';

describe('RecentTransactions', () => {
  it('renders empty state when no transactions', () => {
    render(<RecentTransactions transactions={[]} />);
    expect(screen.getByText(/Sem registros/i)).toBeInTheDocument();
  });

  it('renders provided transactions', () => {
    const txs = [
      { id: '1', type: 'deposit', asset: 'BTC', amount: 0.01, currency: 'BTC', timestamp: '2025-12-01' },
      { id: '2', type: 'trade', asset: 'ETH', amount: 0.2, currency: 'ETH', timestamp: '2025-12-02' },
    ];
    render(<RecentTransactions transactions={txs} />);
    expect(screen.getByText(/deposit/i)).toBeInTheDocument();
    expect(screen.getByText(/0.01 BTC/)).toBeInTheDocument();
    expect(screen.getByText(/2025-12-02/)).toBeInTheDocument();
  });
});

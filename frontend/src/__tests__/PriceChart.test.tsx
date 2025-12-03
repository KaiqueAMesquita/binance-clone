import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock react-chartjs-2 Line component
vi.mock('react-chartjs-2', () => ({
  Line: (props: any) => <div data-testid="chart-placeholder">chart</div>,
}));

import PriceChart from '@/app/currency/components/PriceChart';
import { History } from '@/services/CurrencyService';

describe('PriceChart', () => {
  it('shows message when no history data is provided', () => {
    render(<PriceChart historyData={[]} />);
    expect(screen.getByText(/Não há dados históricos para exibir o gráfico./i)).toBeInTheDocument();
  });

  it('renders chart when history data is provided', () => {
    const data: History[] = [
      { id: 1, datetime: new Date().toISOString(), price: 10, currencyId: 1 },
      { id: 2, datetime: new Date().toISOString(), price: 12, currencyId: 1 },
    ];
    render(<PriceChart historyData={data} />);
    expect(screen.getByTestId('chart-placeholder')).toBeInTheDocument();
  });
});

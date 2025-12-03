import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock currencyAPI
vi.mock('@/services/CurrencyService', () => ({
  currencyAPI: {
    getAll: vi.fn(async () => [
      {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        description: '',
        backing: '',
        histories: [ { id: 1, datetime: new Date().toISOString(), price: 50000 } ],
      },
      {
        id: 2,
        symbol: 'ETH',
        name: 'Ethereum',
        description: '',
        backing: '',
        histories: [ { id: 2, datetime: new Date().toISOString(), price: 2500 } ],
      }
    ])
  }
}));

import TradeConverter from '@/app/wallet/components/TradeConverter';

describe('TradeConverter', () => {
  it('loads currency data and allows invert and max actions', async () => {
    render(<TradeConverter />);

    // Wait for currency data to be loaded and exchange rate to appear
    await waitFor(() => expect(screen.getByText(/1 BTC =/i)).toBeInTheDocument());

    // Click Max button to set amount
    const maxButton = screen.getByText(/Máx\./i);
    fireEvent.click(maxButton);
    // Preview button should be present (disabled unless valid)
    const preview = screen.getByText(/Pré-visualização/i);
    expect(preview).toBeInTheDocument();

    // Click invert button and assert symbols swapped
    const invert = screen.getByLabelText('Inverter');
    fireEvent.click(invert);
    // After invert, exchange rate label should include '1 ETH' or similar
    await waitFor(() => expect(screen.getByText(/1 ETH =/i)).toBeInTheDocument());
  });
});

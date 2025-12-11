import { apiClient } from './apiClient';
import { walletAPI } from './API';

export type BalanceHistoryPoint = {
  label: string;
  value: number;
  fiatValue: number;
};

export type AssetRow = {
  symbol: string;
  name: string;
  quantity: number;
  fiatValue: number;
  fiatCurrency?: string;
  costBasis?: number;
  currentPrice?: number;
  pnlToday?: number;
  pnlIsPositive?: boolean;
  accent?: string;
};

export type WalletSummaryData = {
  estimatedBalanceBtc: number;
  estimatedCurrency: string;
  estimatedBalanceFiat: number;
  fiatSymbol: string;
  pnlToday: {
    value: number;
    percentage: number;
    currency: string;
    isPositive: boolean;
  };
};

// Types returned by backend
export type BackendWallet = {
  id: number;
  currency: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type BackendTransaction = {
  id: number;
  type: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  transactionHash?: string;
  status?: string;
  createdAt: string;
  walletId: number;
};

const walletService = {
  // Backend-aligned methods
  async listWallets(): Promise<BackendWallet[]> {
    const { data, error } = await apiClient.get<BackendWallet[]>(walletAPI.getAll());
    if (error) throw new Error(error);
    return data || [];
  },

  async getWalletById(id: number | string): Promise<BackendWallet | null> {
    const { data, error } = await apiClient.get<BackendWallet>(walletAPI.getById(id));
    if (error) throw new Error(error);
    return data || null;
  },

  async listByUser(userId: number | string): Promise<BackendWallet[]> {
    const { data, error } = await apiClient.get<BackendWallet[]>(walletAPI.getByUser(userId));
    if (error) throw new Error(error);
    return data || [];
  },

  async getTransactionsForWallet(walletId: number | string): Promise<BackendTransaction[]> {
    const { data, error } = await apiClient.get<BackendTransaction[]>(walletAPI.transactionsForWallet(walletId));
    if (error) throw new Error(error);
    return data || [];
  },

  async addTransaction(walletId: number | string, tx: Partial<BackendTransaction>) {
    const { data, error } = await apiClient.post<any>(walletAPI.addTransaction(walletId), tx);
    if (error) throw new Error(error);
    return data;
  },

  // Compatibility wrappers (keep the previously used method names).
  async getSummary(): Promise<WalletSummaryData> {
    // Best-effort summary based on available wallet balances.
    const wallets = await this.listWallets();
    const total = wallets.reduce((s, w) => s + Number(w.balance || 0), 0);
    const exampleCurrency = wallets[0]?.currency || 'USD';
    // Show the summed balance as the primary value so WalletSummary and AssetTable match.
    // `estimatedBalanceBtc` is used by the UI as the large primary number; use the summed balance there.
    return {
      estimatedBalanceBtc: total,
      estimatedCurrency: exampleCurrency,
      estimatedBalanceFiat: total,
      fiatSymbol: '$',
      pnlToday: { value: 0, percentage: 0, currency: '$', isPositive: true },
    };
  },

  async getAssets(): Promise<AssetRow[]> {
    const wallets = await this.listWallets();
    return wallets.map(w => ({
      symbol: w.currency,
      name: w.currency,
      quantity: Number(w.balance || 0),
      fiatValue: Number(w.balance || 0),
      fiatCurrency: '$',
      costBasis: 0,
      currentPrice: 0,
      pnlToday: 0,
      pnlIsPositive: true,
      accent: '#64748b',
    }));
  },

  async getTransactions(): Promise<BackendTransaction[]> {
    // Fetch transactions for all wallets and flatten
    const wallets = await this.listWallets();
    if (!wallets.length) return [];
    const results = await Promise.all(wallets.map(w => this.getTransactionsForWallet(w.id)));
    return results.flat();
  },

  async getHistory(_days = 7): Promise<BalanceHistoryPoint[]> {
    // Backend does not provide a dedicated history endpoint yet — return empty array for now.
    return [];
  },
};

export { walletService };
export default walletService;

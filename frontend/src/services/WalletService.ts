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



// ... (Tipos BalanceHistoryPoint, AssetRow, etc. mantidos iguais) ...

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
  type: number; 
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  transactionHash?: string;
  status?: number;
  createdAt: string;
  walletId: number;
  destinyWalletId?: number | null; 
};

const walletService = {
  async listWallets(): Promise<BackendWallet[]> {
    // Veja como aqui já estava correto usando walletAPI.getAll()
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

   async createWallet(currency: string, userId: number): Promise<BackendWallet> {
    const payload = {
        currency: currency,
        userId: userId,
        balance: 0,
        transactions: [] // <--- ADICIONE ESTA LINHA (Lista vazia para satisfazer o Backend)
    };
    
    // Usando walletAPI.create() para garantir a URL completa correta
    const { data, error } = await apiClient.post<BackendWallet>(walletAPI.create(), payload); 
    
    if (error) throw new Error(error);
    return data as BackendWallet;
  },

  async addTransaction(walletId: number | string, tx: Partial<BackendTransaction>) {
    const { data, error } = await apiClient.post<any>(walletAPI.addTransaction(walletId), tx);
    if (error) throw new Error(error);
    return data;
  },

  async updateWallet(id: number | string, payload: Partial<BackendWallet>) {
    const { data, error } = await apiClient.put<BackendWallet>(walletAPI.update(id), payload);
    if (error) throw new Error(error);
    return data;
  },

  // ... (Métodos getSummary, getAssets, etc. mantidos iguais) ...
  async getSummary(): Promise<WalletSummaryData> {
    const wallets = await this.listWallets();
    const total = wallets.reduce((s, w) => s + Number(w.balance || 0), 0);
    const exampleCurrency = wallets[0]?.currency || 'USD';
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
    const wallets = await this.listWallets();
    if (!wallets.length) return [];
    const results = await Promise.all(wallets.map(w => this.getTransactionsForWallet(w.id)));
    return results.flat();
  },

  async getHistory(_days = 7): Promise<BalanceHistoryPoint[]> {
    return [];
  },
};

export { walletService };
export default walletService;
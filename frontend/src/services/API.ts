// Use per-service base URLs. Allow overriding via NEXT_PUBLIC_* env vars in Next.js.
const WALLET_API_BASE = process.env.NEXT_PUBLIC_WALLET_API ?? 'http://localhost:5026/api';
const USER_API_BASE = process.env.NEXT_PUBLIC_USER_API ?? 'http://localhost:5294/api';
const CURRENCY_API_BASE = process.env.NEXT_PUBLIC_CURRENCY_API ?? 'http://localhost:5237/api';

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

// User endpoints (user API runs on its own port)
const userAPI = crudAPI(`${USER_API_BASE}/User`);

// Wallet and transaction endpoints (wallet API)
const walletBase = `${WALLET_API_BASE}/Wallet`;
const transactionBase = `${WALLET_API_BASE}/Transaction`;

const walletAPI = {
  base: () => walletBase,
  create: () => `${walletBase}`,
  getAll: () => `${walletBase}`,
  getById: (id: string | number) => `${walletBase}/${id}`,
  getByUser: (userId: string | number) => `${walletBase}/user/${userId}`,
  update: (id: string | number) => `${walletBase}/${id}`,
  delete: (id: string | number) => `${walletBase}/${id}`,
  // Transactions endpoints (per wallet)
  transactionsForWallet: (walletId: string | number) => `${transactionBase}/${walletId}/transactions`,
  addTransaction: (walletId: string | number) => `${transactionBase}/${walletId}/transactions`,
};

// Authentication is handled by the User API
const authAPI = {
  login: () => `${USER_API_BASE}/Auth/Login`,
  logout: () => `${USER_API_BASE}/Auth/Logout`,
  refreshToken: () => `${USER_API_BASE}/Auth/RefreshToken`,
};

// Currency base exported for services that need it (fallback via env)
const currencyBase = () => `${CURRENCY_API_BASE}`;

export { userAPI, authAPI, currencyBase };
export { walletAPI };

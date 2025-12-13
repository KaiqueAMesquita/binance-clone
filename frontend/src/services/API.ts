// Atualizando as constantes de base para apontar para o gateway
const GATEWAY_BASE = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:5048';
const CURRENCY_API_BASE = `${GATEWAY_BASE}/currency`;
const WALLET_API_BASE = `${GATEWAY_BASE}/wallet`;
const USER_API_BASE = `${GATEWAY_BASE}/user`;
const AUTH_API_BASE = `${GATEWAY_BASE}/auth`;

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

// User endpoints (atualizado para usar o gateway)
const userAPI = {
  ...crudAPI(`${USER_API_BASE}`),
  // Adicionando endpoints específicos do usuário, se necessário
};

// Wallet endpoints (atualizado para usar o gateway)
const walletAPI = {
  base: () => WALLET_API_BASE,
  create: () => `${WALLET_API_BASE}`,
  getAll: () => `${WALLET_API_BASE}`,
  getById: (id: string | number) => `${WALLET_API_BASE}/${id}`,
  getByUser: (userId: string | number) => `${WALLET_API_BASE}/user/${userId}`,
  update: (id: string | number) => `${WALLET_API_BASE}/${id}`,
  delete: (id: string | number) => `${WALLET_API_BASE}/${id}`,
  deposit: () => `${WALLET_API_BASE}/deposit`,
  transfer: () => `${WALLET_API_BASE}/transfer`,
  transactionsForWallet: (walletId: string | number) => 
    `${WALLET_API_BASE}/${walletId}/transactions`,
  addTransaction: (walletId: string | number) => 
    `${WALLET_API_BASE}/${walletId}/transactions`,
};

// Authentication endpoints (atualizado para usar o gateway)
const authAPI = {
  login: () => `${AUTH_API_BASE}/login`,
  logout: () => `${AUTH_API_BASE}/logout`,
  refreshToken: () => `${AUTH_API_BASE}/refreshtoken`,
  profile: () => `${AUTH_API_BASE}/profile`,
};

// Currency endpoints (atualizado para usar o gateway)
const currencyAPI = {
  ...crudAPI(CURRENCY_API_BASE),
  convert: () => `${CURRENCY_API_BASE}/convert`,
  summary: () => `${CURRENCY_API_BASE}/summary`,
  chart: (id: string | number) => `${CURRENCY_API_BASE}/${id}/chart`,
};

export { userAPI, authAPI, walletAPI, currencyAPI };
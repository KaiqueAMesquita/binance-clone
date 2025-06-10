const BASE_URL = "http://localhost:5237/api";

export interface History {
  id: number;
  datetime: string;
  price: number;
  currencyId: number;
}

export interface Currency {
  id: number;
  symbol: string;
  name: string;
  description: string;
  backing: string;
  histories: History[];
}

const currencyService = {
  getAll: async (): Promise<Currency[]> => {
    const response = await fetch(`${BASE_URL}/Currency`);
    if (!response.ok) {
      throw new Error('Falha ao buscar moedas.');
    }
    return response.json();
  },

  getById: async (id: string | number): Promise<Currency> => {
    const response = await fetch(`${BASE_URL}/Currency/${id}`);
    if (!response.ok) {
      throw new Error(`Falha ao buscar moeda com id ${id}.`);
    }
    return response.json();
  },

  create: async (currency: Currency): Promise<string> => {
    try {
      // Gerar um symbol baseado no nome da moeda
      const symbol = currency.name
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .substring(0, 3);

      const response = await fetch(`${BASE_URL}/Currency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0, // ID será gerado pelo backend
          symbol: symbol,
          name: currency.name,
          description: currency.description,
          backing: currency.backing,
          histories: []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao criar moeda: ${response.status}`);
      }

      const result = await response.json();
      return result.symbol;
    } catch (error) {
      console.error('Erro detalhado:', error);
      throw error;
    }
  },
};

export { currencyService as currencyAPI };

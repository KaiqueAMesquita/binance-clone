const BASE_URL = "http://localhost:5237/api";

export interface History {
  id: number;
  datetime: string;
  price: number;
  currencyId: number;
}

export interface Currency {
  id: number;
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
};

export { currencyService as currencyAPI };

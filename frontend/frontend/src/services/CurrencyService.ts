import { create } from "domain";

const BASE_URL = "http://localhost:5237/api";

const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

const currencyAPI = crudAPI(`${BASE_URL}/Currency`);


export { currencyAPI };

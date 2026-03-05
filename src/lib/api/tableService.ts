import { api } from "./axiosClient";

export interface IServiceTableItem {
  id: number;
  serviceColumn: string;
  initialColumn: string;
  standardColumn: string;
  optimalColumn: string;

  isNew?: boolean;
  isEdited?: boolean;
}

const BASE_PATH = "/service-table";

export const fetchServiceTable = async (): Promise<IServiceTableItem[]> => {
  // api.baseURL уже указывает на API_URL, добавляем только путь контроллера
  const response = await api.get<IServiceTableItem[]>(BASE_PATH);
  return response.data;
};

export const createServiceTableItem = async (
  item: IServiceTableItem,
): Promise<IServiceTableItem> => {
  const { isNew, isEdited, id, ...data } = item;
  const response = await api.post<IServiceTableItem>(BASE_PATH, data);
  return response.data;
};

export const updateServiceTableItem = async (
  id: number,
  item: IServiceTableItem,
): Promise<IServiceTableItem> => {
  const { isNew, isEdited, ...data } = item;
  const response = await api.put<IServiceTableItem>(`${BASE_PATH}/${id}`, data);
  return response.data;
};

export const deleteServiceTableItem = async (id: number): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};

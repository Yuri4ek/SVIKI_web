import { api } from "./axiosClient";

// Типы данных
export interface PagedInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface PagedResult<T> {
  pagedInfo: PagedInfo;
  value: T;
}

// Унифицированный интерфейс для UI
export interface UserBase {
  id: number; // Основной ключ для FlashList (UserId или Id)
  originalId?: number; // Дополнительный ID (например, ClientId)
  name: string;
  email?: string;
  phone?: number;
  rolesString?: string;
  status?: number;
  progressWidth?: string;
}

// Хелпер для создания чистого URL без лишних слешей
// Если search пустой, возвращает "base/page/size"
// Если search есть, возвращает "base/page/size/encodedSearch"
const buildUrl = (
  base: string,
  page: number,
  size: number,
  search?: string,
) => {
  const cleanSearch = search ? search.trim() : "";
  if (cleanSearch.length > 0) {
    return `${base}/${page}/${size}/${encodeURIComponent(cleanSearch)}`;
  }
  return `${base}/${page}/${size}`;
};

export const usersService = {
  standardizeUser: (item: any): UserBase => {
    const rawName =
      item.name && item.name.trim()
        ? item.name
        : item.phone
          ? item.phone.toString()
          : item.email || "Новый пользователь";

    // Очищаем имя от банковских реквизитов (берем только первую часть до ||)
    const displayName = rawName.split("||")[0];

    return {
      id: item.userId || item.id,
      originalId: item.clientId,
      name: displayName,
      email: item.email || "—",
      phone: item.phone || 0,
      rolesString: item.rolesString || "",
      progressWidth: "0",
      status: 0,
    };
  },

  // 1. Клиенты (Теперь через эндпоинт /users, чтобы видеть ВСЕХ 13)
  getManagerClients: async (
    page: number,
    size: number,
    search: string = "",
  ): Promise<PagedResult<UserBase[]>> => {
    // Используем стабильный эндпоинт без багов в расчете статуса
    const url = `/manager/users/${page}/${size}`;
    const response = await api.get<PagedResult<any[]>>(url);

    const allUsers = response.data.value.map(usersService.standardizeUser);

    // Фильтруем только клиентов
    let clients = allUsers.filter((u) => u.rolesString?.includes("Client"));

    // Локальный поиск (защита от ошибки 400 на бэкенде при ToString())
    if (search.trim()) {
      const s = search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(s) || c.phone?.toString().includes(s),
      );
    }

    return { ...response.data, value: clients };
  },

  // 2. Агенты (для Менеджеров/Админов)
  getManagerAgents: async (
    page: number,
    size: number,
    search: string = "",
  ): Promise<PagedResult<UserBase[]>> => {
    const url = buildUrl("/manager/agents", page, size, search);
    const response = await api.get<PagedResult<any[]>>(url);

    // Маппинг AgentModel [cite: 491] -> UserBase
    return {
      ...response.data,
      value: response.data.value.map((item) => ({
        id: item.id, // У AgentModel поле Id
        name: item.name,
        email: item.email,
        phone: item.phone,
        rolesString: item.rolesString,
      })),
    };
  },

  // 3. Юристы (для Менеджеров/Админов)
  getManagerLawyers: async (
    page: number,
    size: number,
    search: string = "",
  ): Promise<PagedResult<UserBase[]>> => {
    // Внимание: в контроллере путь "lawyer" (ед. число) [cite: 935]
    const url = buildUrl("/manager/lawyer", page, size, search);
    const response = await api.get<PagedResult<any[]>>(url);

    // Маппинг AgentModel (используется для юристов) -> UserBase
    return {
      ...response.data,
      value: response.data.value.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        rolesString: item.rolesString,
      })),
    };
  },

  // 4. Все пользователи (для Менеджеров/Админов)
  getAllUsers: async (
    page: number,
    size: number,
  ): Promise<PagedResult<UserBase[]>> => {
    const url = `/manager/users/${page}/${size}`;
    const response = await api.get<PagedResult<any[]>>(url);
    return {
      ...response.data,
      value: response.data.value.map(usersService.standardizeUser),
    };
  },

  // 5. Клиенты Агента (Рефералы)
  getAgentClients: async (
    page: number,
    size: number,
    search: string = "",
  ): Promise<PagedResult<UserBase[]>> => {
    const url = buildUrl("/agent/clients", page, size, search);
    const response = await api.get<PagedResult<any[]>>(url);

    // Маппинг ClientModel -> UserBase
    return {
      ...response.data,
      value: response.data.value.map((item) => ({
        id: item.userId,
        originalId: item.clientId,
        name: item.name,
        email: item.email,
        phone: item.phone,
        progressWidth: item.progressWidth,
        status: item.status,
      })),
    };
  },

  // 6. Команда Клиента (из ChatController)
  getMyTeam: async () => {
    // Используем ChatController [cite: 873]
    const response = await api.get<any[]>("/chat/client-contacts");

    // Маппинг ContactModel [cite: 394] -> UserBase
    return response.data.map((item) => ({
      id: item.receiverId,
      name: item.name,
      // Остальные поля могут отсутствовать в модели чата
      email: "",
      phone: 0,
    }));
  },

  addManager: async (data: {
    name: string;
    email: string;
    phone: number;
    password: string;
  }) => {
    // Вызываем эндпоинт из ManagerController
    const response = await api.post("/manager/manager-access", data);
    return response.data;
  },
};

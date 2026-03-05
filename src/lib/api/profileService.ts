import { api } from "./axiosClient";

// Интерфейс, соответствующий JSON ответа/запроса
export interface UserInfoModel {
  userId: number;
  clientId: number;
  name: string; // User.Name (ФИО целиком)
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone: number;
  isBlocked?: boolean;
  rolesString?: string;
  status?: number;
  progressWidth?: string;
  regionCode: number;
  questionnaire?: any;
}

export const profileService = {
  // Получение данных пользователя
  getUserInfo: async (): Promise<UserInfoModel> => {
    const response = await api.get<UserInfoModel>("/client/user-info");
    return response.data;
  },

  // Сохранение данных пользователя
  saveUserInfo: async (data: UserInfoModel): Promise<void> => {
    try {
      // Отправляем POST запрос с обновленной моделью
      await api.post("/client/user-info", data);
    } catch (error) {
      console.error("Error saving user info:", error);
      throw error;
    }
  },

  // Отправка письма подтверждения
  sendConfirmationEmail: async (email: string) => {
    const response = await api.post(
      "/auth/send-confirmation-email",
      JSON.stringify(email),
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  },
};

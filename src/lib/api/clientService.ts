import { api } from "./axiosClient";

// 1. Интерфейс данных, приходящих с бэкенда (DTO)
export interface QuestionnaireDto {
  id?: number;
  hasActiveLoans: boolean;
  loanAmount?: string;
  creditorsCount?: string;
  creditorsType?: string;
  hasGracePeriod: boolean;
  gracePeriodMonths?: string;
  gracePeriodDebtStatus?: string;
  hasMortgage: boolean;
  mortgageBalance?: string;
  hasAdditionalProperty: boolean;
  hasCar: boolean;
  carValue?: string;
  hasCarLoan: boolean;
  carLoanBalance?: string;
  isEmployed: boolean;
  hasFSSPDebt: boolean;
  fsspDebtAmount?: string;
  hasTaxDebt: boolean;
  taxDebtAmount?: string;
  clientId?: number;
}

// Вспомогательный интерфейс для полей дашборда
export interface DashboardField {
  answer: string;
  details: string;
}

// 2. Строго типизированный интерфейс для UI (Dashboard)
export interface ClientDashboardData {
  userId?: number;
  clientId?: number;
  questionnaireId?: number;
  name: string;
  email?: string;
  phone?: number;
  status?: number;
  progressWidth: string;
  questionnaireIsFinished?: boolean;
  lawyerName?: string;
  managerName?: string;

  // Типизированные поля вместо магических строк
  car: DashboardField;
  carLoan: DashboardField;
  mortgage: DashboardField;
  additionalProperty: DashboardField;
  fsspDebt: DashboardField;
  taxDebt: DashboardField;
  activeLoans: DashboardField;
  isEmployed: DashboardField;

  // Поля, которые пока могут не приходить с бэкенда
  creditScoreNBKI: string;
  creditScoreOKB: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email?: string;
  phone?: string; // Рекомендую string для телефонов (из-за + или ведущих нулей)
  status?: number;
  lawyerName?: string;
  managerName?: string;
}

export interface InvitedUser {
  id: number;
  name: string;
  registrationDate: string;
  status: string;
}

export interface ReferralData {
  qrCode: string; // Base64 или URL
  link: string;
}

export interface LawyerOption {
  id: number;
  fullName: string;
  specialization?: string;
}

// 3. Функция маппинга (Преобразование DTO -> UI формат)
export const mapDtoToDashboard = (
  data: QuestionnaireDto,
): ClientDashboardData => {
  if (!data) {
    return {} as ClientDashboardData; // Возвращаем пустой объект или дефолтный стейт в случае отсутствия данных
  }

  // Хелперы для безопасного преобразования
  const toYesNo = (val: boolean | undefined | null) => (val ? "Да" : "Нет");
  const getDetails = (val: string | undefined | null) => val || "";

  return {
    // --- Технические поля ---
    clientId: data.clientId,
    questionnaireId: data.id,
    name: "Клиент", // TODO: Заменить на реальные данные при получении
    progressWidth: "0",

    // --- Секция: Транспорт ---
    car: {
      answer: toYesNo(data.hasCar),
      details: getDetails(data.carValue),
    },
    carLoan: {
      answer: toYesNo(data.hasCarLoan),
      details: getDetails(data.carLoanBalance),
    },

    // --- Секция: Недвижимость ---
    mortgage: {
      answer: toYesNo(data.hasMortgage),
      details: getDetails(data.mortgageBalance),
    },
    additionalProperty: {
      answer: toYesNo(data.hasAdditionalProperty),
      details: "",
    },

    // --- Секция: Задолженности ---
    fsspDebt: {
      answer: toYesNo(data.hasFSSPDebt),
      details: getDetails(data.fsspDebtAmount),
    },
    taxDebt: {
      answer: toYesNo(data.hasTaxDebt),
      details: getDetails(data.taxDebtAmount),
    },

    // --- Прочие поля ---
    activeLoans: {
      answer: toYesNo(data.hasActiveLoans),
      details: getDetails(data.loanAmount),
    },
    isEmployed: {
      answer: toYesNo(data.isEmployed),
      details: "",
    },

    // --- Заглушки для отсутствующих данных ---
    creditScoreNBKI: "Нет данных",
    creditScoreOKB: "Нет данных",
  };
};

export const clientService = {
  getQuestionnaire: async (): Promise<QuestionnaireDto> => {
    const response = await api.get<QuestionnaireDto>("/client/questionnaire");
    return response.data;
  },

  saveQuestionnaire: async (data: QuestionnaireDto): Promise<void> => {
    await api.post("/client/questionnaire", data);
  },

  checkQuestionnaireFinished: async (): Promise<boolean> => {
    const response = await api.get<boolean>(
      "/client/questionnaire-is-finished",
    );
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get("/client/user-info");
    return response.data;
  },

  getUserInviteds: async (): Promise<InvitedUser[]> => {
    const response = await api.get<InvitedUser[]>("/client/user-inviteds");
    return response.data;
  },

  getReferralQrCode: async (): Promise<ReferralData> => {
    const response = await api.get("/client/referral-link-qrcode");
    return response.data;
  },

  getLawyerSelectList: async (clientId: number): Promise<LawyerOption> => {
    const response = await api.get(`/client/lawyer-selectlist/${clientId}`);
    return response.data;
  },

  selectLawyer: async (clientId: number, lawyerId: number): Promise<void> => {
    await api.post("/client/lawyer-selected", { clientId, lawyerId });
  },
};

import { useState, useEffect } from "react";
import {
  clientService,
  mapDtoToDashboard,
  ClientDashboardData,
} from "@/lib/api";

export const ClientDashboard = () => {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const dto = await clientService.getQuestionnaire();
      const formattedData = mapDtoToDashboard(dto);
      setData(formattedData);
    } catch (error) {
      console.error("Ошибка загрузки анкеты в дашборде", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full pb-20">
      <div className="flex justify-between items-center mt-4 mb-2">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">
          СВИКИ
        </h1>
      </div>

      {/* Секция: Кредитный рейтинг */}
      <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2">
        Кредитный рейтинг
      </h2>
      <div
        className="bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)] cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors"
        onClick={() => setShowHistory(true)}
      >
        <div className="flex flex-row justify-between gap-3">
          <div className="flex-1 flex flex-col items-center bg-[var(--color-secondary-container)] p-4 rounded-xl">
            <span className="text-2xl font-bold text-[var(--color-on-secondary-container)]">
              {data.creditScoreNBKI}
            </span>
            <span className="text-sm text-[var(--color-on-secondary-container)] opacity-80 mt-1">
              НБКИ
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center bg-[var(--color-secondary-container)] p-4 rounded-xl">
            <span className="text-2xl font-bold text-[var(--color-on-secondary-container)]">
              {data.creditScoreOKB}
            </span>
            <span className="text-sm text-[var(--color-on-secondary-container)] opacity-80 mt-1">
              ОКБ
            </span>
          </div>
        </div>
        <p className="text-center text-xs mt-3 opacity-60 text-[var(--color-on-surface-variant)]">
          Нажмите для просмотра динамики
        </p>
      </div>

      {/* Секция: Транспорт */}
      <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2">
        Транспорт
      </h2>
      <div className="bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)]">
        <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Авто в собственности
          </span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
            {data.car?.answer || "Нет"}
          </span>
        </div>
        {data.car?.answer === "Да" && (
          <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
            <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
              Стоимость
            </span>
            <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
              {data.car?.details}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Автокредит
          </span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
            {data.carLoan?.answer || "Нет"}{" "}
            {data.carLoan?.answer === "Да" && data.carLoan?.details
              ? `(${data.carLoan.details})`
              : ""}
          </span>
        </div>
      </div>

      {/* Секция: Недвижимость */}
      <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2">
        Недвижимость
      </h2>
      <div className="bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)]">
        <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Ипотека
          </span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
            {data.mortgage?.answer || "Нет"}
          </span>
        </div>
        {data.mortgage?.answer === "Да" && (
          <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
            <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
              Остаток долга
            </span>
            <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
              {data.mortgage?.details}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Доп. имущество
          </span>
          <span className="text-sm font-semibold text-[var(--color-on-surface)] text-right flex-1">
            {data.additionalProperty?.answer || "Нет"}
          </span>
        </div>
      </div>

      {/* Секция: Задолженности */}
      <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-3 mt-6 ml-2">
        Задолженности
      </h2>
      <div className="bg-[var(--color-surface-container)] rounded-xl p-4 mb-3 border border-[var(--color-outline-variant)]">
        <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Долги ФССП
          </span>
          <span
            className={`text-sm font-semibold text-right flex-1 ${data.fsspDebt?.answer === "Нет" ? "text-emerald-500" : "text-[var(--color-error)]"}`}
          >
            {data.fsspDebt?.answer || "Нет"}{" "}
            {data.fsspDebt?.answer === "Да" && data.fsspDebt?.details
              ? `(${data.fsspDebt.details})`
              : ""}
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-[var(--color-on-surface-variant)] flex-1">
            Налоги
          </span>
          <span
            className={`text-sm font-semibold text-right flex-1 ${data.taxDebt?.answer === "Нет" ? "text-emerald-500" : "text-[var(--color-error)]"}`}
          >
            {data.taxDebt?.answer || "Нет"}{" "}
            {data.taxDebt?.answer === "Да" && data.taxDebt?.details
              ? `(${data.taxDebt.details})`
              : ""}
          </span>
        </div>
      </div>

      {/* Модальное окно истории */}
      {showHistory && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="bg-[var(--color-background)] rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-[var(--color-on-surface)] mb-4">
              Динамика рейтинга
            </h2>
            <div className="my-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-outline-variant)]">
                <span className="text-sm text-[var(--color-on-surface-variant)]">
                  Текущий месяц
                </span>
                <span className="text-base font-bold text-[var(--color-on-surface)]">
                  Нет данных
                </span>
              </div>
            </div>
            <button
              className="w-full h-12 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-semibold mt-4 hover:opacity-90 transition-opacity"
              onClick={() => setShowHistory(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
